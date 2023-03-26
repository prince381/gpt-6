import os
import sys
from models.build import construct_index, query, setKey

# Get the path to the myapp folder and add it to the Python path
myapp_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'myapp'))
sys.path.insert(0, myapp_path)

from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        data = request.get_json()
        prompts = data['prompts']
        current_prompt = prompts[-1]
        response = query(current_prompt['content'])
        return jsonify({"response": response})
    
    return "Hello World!"

if __name__ == "__main__":
    setKey()
    if not os.path.exists("index.json"):
        construct_index(r"./data/context")
    # print(query("Hello World!"))
    app.run(debug=True)