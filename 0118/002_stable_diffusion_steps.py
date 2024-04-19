'''
Diffusion with different steps each time.
'''

from diffusers import StableDiffusionPipeline
from utils import clean_prompt, ddyymm_hhmmss
import torch

# Config
STEPS = 15
SEED = 123
TORCH_DEVICE = 'mps'

# Create a Stable Diffusion pipeline
pipe = StableDiffusionPipeline.from_pretrained('runwayml/stable-diffusion-v1-5')
pipe.to(TORCH_DEVICE)

# Generate
prompt = "oil painting, a metal polished sculpture in the middle of the bustling city, masterpiece"
for i in range(1,30):
    generator = torch.Generator(TORCH_DEVICE).manual_seed(SEED)
    print(f'› {i} steps...')
    steps = i
    image = pipe(prompt, num_inference_steps=steps, generator=generator).images[0]

    # Save the image
    cleaned_prompt = clean_prompt(prompt)
    image.save(f'outputs/{ddyymm_hhmmss()}_{cleaned_prompt}_steps{steps:03}.png')