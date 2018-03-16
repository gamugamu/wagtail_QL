# coding: utf-8
# flask_sqlalchemy/app.py
from flask import Flask, request, render_template
from werkzeug.contrib.fixers import ProxyFix
from flask_graphql import GraphQLView
from flask import json
from flask import Response
from flask_cors import CORS
from models import db_session
from schema import schema
from bucket import config_minio_bucket, setup_minio_bucket, upload_to_default_bucket
import ConfigParser


app = Flask(__name__)
CORS(app)
app.debug       = True
app.wsgi_app    = ProxyFix(app.wsgi_app)

# graphQL services
app.add_url_rule(
    '/graphql',
    view_func=GraphQLView.as_view(
        'graphql',
        schema          = schema,
        graphiql        = True, # for having the GraphiQL interface,
        context_value   = {'session': db_session},
    ),
)

# Gunicorn entry point generator
def build_app(*args, **kwargs):
    # n'accepte qu'un argument

    env_application = args[0]
    config          = ConfigParser.ConfigParser()
    config.read('config.ini')
    # pointe sur le bon domaine. Le process peut être lent, et
    # gunicorn veut son app direct.
    domaine_name = config.get(env_application, 'bucket_url')
    is_secure    = config.get(env_application, 'bucket_url_is_https')
    config_minio_bucket(domaine_name, is_secure)

    return app

@app.before_first_request
def _run_on_start():
    # permet de créer le bucket si il n'existe pas + d'autres conf qui
    # peuvent prendre du temps
    setup_minio_bucket()

@app.route('/')
def info():
    return render_template('info.html'
    )

#image upload. GraphQl ne gère pas bien les uploads de data.
@app.route('/uploadfile', methods=['POST'])
def upload_file():
    uuid = upload_to_default_bucket(request.files["file"])

    response = Response(
        response    = json.dumps({'file_id': uuid}),
        status      = 200,
        mimetype    = 'application/json'
    )
    return response

#lifecycle
@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()

if __name__ == '__main__':
    app.run(debug=True)
