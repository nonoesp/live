'''
Custom diffusers pipeline.
https://huggingface.co/blog/stable_diffusion
'''
from transformers import CLIPTextModel, CLIPTokenizer
from diffusers import AutoencoderKL, UNet2DConditionModel, LMSDiscreteScheduler
import torch
from PIL import Image
from utils import clean_prompt, ddyymm_hhmmss

# Config
TORCH_DEVICE = 'mps'
SEED = 124

# Load the autoencoder model
vae = AutoencoderKL.from_pretrained('runwayml/stable-diffusion-v1-5', subfolder='vae')

# Load the tokenizer and text encoder to tokenize and encode the text
tokenizer = CLIPTokenizer.from_pretrained('openai/clip-vit-large-patch14')
text_encoder = CLIPTextModel.from_pretrained('openai/clip-vit-large-patch14')

# Load the U-Net model for generating the latents
unet = UNet2DConditionModel.from_pretrained('runwayml/stable-diffusion-v1-5', subfolder='unet')

# Load the scheduler
scheduler = LMSDiscreteScheduler(
    beta_start=0.00085,
    beta_end=0.012,
    beta_schedule="scaled_linear",
    num_train_timesteps=1000,
)

# Move models to the GPU
vae.to(TORCH_DEVICE)
text_encoder.to(TORCH_DEVICE)
unet.to(TORCH_DEVICE)

# Image generation parameters
prompt = ["oil painting of a gray rock in the jungle, open space"]
cleaned_prompt = clean_prompt(prompt[0])
width = 1024
height = 512
num_inference_steps = 50
guidance_scale = 7.5 # Scale for classifier-free guidance
# generator = torch.Generator(TORCH_DEVICE).manual_seed(SEED)
generator = torch.manual_seed(SEED)
batch_size = len(prompt)

# Text guidance
text_input = tokenizer(
    prompt,
    padding="max_length",
    max_length=tokenizer.model_max_length,
    truncation=True,
    return_tensors="pt"
)

text_embeddings = text_encoder(
    text_input.input_ids.to(TORCH_DEVICE)
)[0]

# Padding token text embeddings for classifier-free guidance
max_length = text_input.input_ids.shape[-1]
uncond_input = tokenizer(
    [""] * batch_size,
    padding="max_length",
    max_length=max_length,
    return_tensors="pt"
)
uncond_embeddings = text_encoder(
    uncond_input.input_ids.to(TORCH_DEVICE)
)[0]

# Concatenate text and unconditioned embeddings
# to avoid doing two forward passes
text_embeddings = torch.cat([uncond_embeddings, text_embeddings])

# Generate the initial random noise
# [1,4,64,64]
latents = torch.randn(
    (batch_size, unet.in_channels, height // 8, width // 8),
    generator=generator
)
latents = latents.to(TORCH_DEVICE)

# Initialize the scheduler
scheduler.set_timesteps(num_inference_steps)

# Multiply the latents by the schedules sigma values
latents = latents * scheduler.init_noise_sigma

def save_image_from_latents(latents, step):
    # Scale and decode the image latents with the vae
    latents = 1 / 0.18215 * latents.clone()
    with torch.no_grad():
        image = vae.decode(latents).sample

    # Convert the image to PIL to display or save
    image = (image / 2 + 0.5).clamp(0, 1)
    image = image.detach().cpu().permute(0,2,3,1).numpy()
    images = (image * 255).round().astype("uint8")
    pil_images = [Image.fromarray(image) for image in images]

    # Save the images
    for img in pil_images:
        img.save(f'outputs/{ddyymm_hhmmss()}_{cleaned_prompt}_step{step:03}-of-{num_inference_steps:03}.png')

# Perform the denoising loop!

from tqdm.auto import tqdm

scheduler.set_timesteps(num_inference_steps)

# print(scheduler.timesteps)
# [999.0000, 946.4211, 893.8421, 841.2632, 788.6842, 736.1053, 683.5263, 630.9474, 578.3684, 525.7895, 473.2105, 420.6316, 368.0526, 315.4737, 262.8947, 210.3158, 157.7368, 105.1579, 52.5789, 0.0000]

i = 0
for t in tqdm(scheduler.timesteps):
    
    # Expand the latents if we are doing classifier free
    # guidance to avoid doing two forward passes
    latent_model_input = torch.cat([latents] * 2)

    latent_model_input = scheduler.scale_model_input(
        latent_model_input,
        timestep=t
    )

    # Predict the noise residual
    with torch.no_grad():
        noise_pred = unet(
            latent_model_input,
            t,
            encoder_hidden_states=text_embeddings
        ).sample

    # Perform guidance
    noise_pred_uncond, noise_pred_text = noise_pred.chunk(2)
    noise_pred = noise_pred_uncond + guidance_scale * (noise_pred_text - noise_pred_uncond)

    # Compute the previous noisy sample x_t → x_t-1
    latents = scheduler.step(noise_pred, t, latents).prev_sample

    # Save the current image from the latents
    save_image_from_latents(latents, i+1)
    i += 1