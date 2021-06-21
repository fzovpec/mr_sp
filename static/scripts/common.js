var backend_url = 'http://127.0.0.1:5000/';
var previous_data = {
    'summary_text': '',
    'summaty_link_text': ''
};
var element_prefixes = {
    'source_summary_output': 'Source summary: '
};
var ids_for_tasks = {
    'summarize': 0,
    'get_artlicle_by_link': 1
};
var allowed_websites = ['bbc.com', 'nytimes.com'];
// Work with the text inputed in the source text
function check_if_input_is_valid(text){
    return !!text;
}

function insert_the_text_in_frontend_field(text, element_to_input){
    document.getElementById(element_to_input).textContent = element_prefixes[element_to_input] + text;
}

function fetch_data_from_backend(text, task_name){
    var data = {
        'id': ids_for_tasks[task_name],
        'text': text
    };

    var xhr = new XMLHttpRequest();
    xhr.open("POST", backend_url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));

    return xhr;

}

function summarize_inputted_text(){
    var short_text = document.getElementById('source_text').value;

    if (short_text == previous_data['summary_text'] || !check_if_input_is_valid(short_text)){

    } // In the case inputted text doesn't
    // change or it's not valid

    else {
        xhr = fetch_data_from_backend(short_text, 'summarize');
        xhr.onload = function() {
            var json_response = JSON.parse(xhr.response);
            var text_from_response = json_response['text'];
            insert_the_text_in_frontend_field(text_from_response, 'source_summary_output');
        };

        previous_data['summary_text'] = short_text;
    }
}

setInterval(summarize_inputted_text, 1000);

// Works with the links

function check_inputed_website(link_text){
    if (link_text.includes('.') == true){
        return true;
    }
    return false;
}


function get_the_text_from_website_or_ask_for_it(){
    var to_website_link = document.getElementById('source_link').value;
    var if_input_is_valid = check_if_input_is_valid(to_website_link);
    var if_input_website_is_valid = check_inputed_website(to_website_link);

    if(if_input_website_is_valid && if_input_is_valid && previous_data['summaty_link_text'] != to_website_link){
        // there should be a code, which would parse that website and input the text into the source_text field
        document.getElementById('source_text_block').style.height = 0;
        document.getElementById('source_warning_text').style.display = 'none';
        previous_data['summaty_link_text'] = to_website_link;

        xhr = fetch_data_from_backend(to_website_link, 'get_artlicle_by_link');
        xhr.onload = function() {
            var json_response = JSON.parse(xhr.response);
            var text_from_response = json_response['text'];

            insert_the_text_in_frontend_field(text_from_response, 'source_summary_output');
        };

    }
    else if(!if_input_is_valid && !if_input_website_is_valid){
        document.getElementById('source_text_block').style.height = 0;
        document.getElementById('source_warning_text').style.display = 'none';
    }
    else if(if_input_is_valid && !if_input_website_is_valid){
        document.getElementById('source_warning_text').style.display = 'block';
        for(var i = 0; i <= 100; i++){
            document.getElementById('source_text_block').style.height = i + '%';
        }
    }
}

setInterval(get_the_text_from_website_or_ask_for_it, 1000);