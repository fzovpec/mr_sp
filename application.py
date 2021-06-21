from flask import Flask, request, render_template, make_response
from flask_restful import Resource, Api
from flask_cors import CORS
import requests
import json

# EB looks for an 'application' callable by default.
application = Flask(__name__)
CORS(application, supports_credentials=True)
api = Api(application)


class MRGeneralApi(Resource):

    def __init__(self):
        self.summarization_api_url = 'https://text-monkey-summarizer.p.rapidapi.com/nlp/summarize'

    def get(self):
        headers = {'Content-Type': 'text/html'}
        return make_response(render_template('index.html'), 200, headers)

    def post(self):
        data = request.get_json()
        print(data)
        if str(data['id']) == '0':
            # Calls a block which then summarizes given text
            # final_text = text_summarizer.summarizer(data['text'])
            try:
                final_text = self.call_to_text_summarizer_api_with_text(data['text'])
                if not final_text:
                    final_text = 'Unfortunately it\'s not possible to summarize the source'

            except KeyError:
                print('Request cannot be handled')
                final_text = 'Unfortunately it\'s not possible to summarize the source'

        elif str(data['id']) == '1':
            # Parses the website data and then gives the article text
            try:
                final_text = self.call_to_text_summarizer_api_with_url(data['text'])
            except KeyError:
                print('Request cannot be handled')
                final_text = ''

        elif str(data['id']) == '2':
            # Detect if the text is biased
            # final_text = fake_detector(data['text'])
            final_text = str(0)
        elif str(data['id']) == '3':
            # Detects how relevant the text is
            # final_text = relevance_identifier(data['text'])
            final_text = str(0)
        else:
            final_text = 'Error, such a task doesn\'t exist'

        return {'text': final_text}

    def call_to_text_summarizer_api_with_text(self, text):
        payload = "{\n    \"text\": \"" + text.replace("\n", "").replace("\"", "") + "\"\n}"

        return self.call_to_text_summarizer_api_with_payload(payload)

    def call_to_text_summarizer_api_with_url(self, website_url):
        payload = "{\"url\": \"" + website_url + "\"\n}"
        
        return self.call_to_text_summarizer_api_with_payload(payload)

    def call_to_text_summarizer_api_with_payload(self, payload):
        headers = {
            'content-type': "application/json",
            'x-rapidapi-key': "6a065de175msh61c116604709cafp17b666jsn22e2813483ce",
            'x-rapidapi-host': "text-monkey-summarizer.p.rapidapi.com"
            }
        #print(payload[220:280])
        response = requests.request("POST", self.summarization_api_url, data=payload.encode('utf-8'), headers=headers)
        print(response.text)

        if not json.loads(response.text)['summary']:
            return ''.join(json.loads(response.text)['snippets'])

        return json.loads(response.text)['summary']


api.add_resource(MRGeneralApi, '/')

# run the app.
if __name__ == "__main__":
    # Setting debug to True enables debug output. This line should be
    # removed before deploying a production app.
    application.debug = True
    application.run()
