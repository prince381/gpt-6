from gpt_index import SimpleDirectoryReader, GPTListIndex, readers, GPTSimpleVectorIndex, LLMPredictor, PromptHelper
from langchain import OpenAI
import sys
import os


def construct_index(directory_path: str):
    max_input_size = 4096
    num_outputs = 300
    max_chunk_overlap = 20
    chunk_size_limit = 600
    
    llm_predictor = LLMPredictor(llm=OpenAI(temperature=0.5, model_name='text-davinci-003', max_tokens=num_outputs))
    
    prompt_helper = PromptHelper(max_input_size, num_outputs,max_chunk_overlap, chunk_size_limit=chunk_size_limit)
    
    documents = SimpleDirectoryReader(directory_path).load_data()
    
    index = GPTSimpleVectorIndex(documents,llm_predictor=llm_predictor, prompt_helper=prompt_helper)
    
    index.save_to_disk('index.json')
    
    return index

def query(prompt: str):
    index = GPTSimpleVectorIndex.load_from_disk('index.json')
    response = index.query(prompt, response_mode='compact')
    return response
        
def setKey():
    os.environ["OPENAI_API_KEY"] = "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"
    
def build_history(prompts):
    pass