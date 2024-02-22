# https://huggingface.co/google/gemma-2b-it#running-the-model-on-a-cpu
from transformers import AutoTokenizer, AutoModelForCausalLM

tokenizer = AutoTokenizer.from_pretrained("google/gemma-2b-it")
model = AutoModelForCausalLM.from_pretrained("google/gemma-2b-it")

input_text = "Places to visit in Malaga, Spain."
input_ids = tokenizer(input_text, return_tensors="pt")

outputs = model.generate(**input_ids, max_length=512)
print(tokenizer.decode(outputs[0]))