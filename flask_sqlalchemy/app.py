# flask_sqlalchemy/app.py
from flask import Flask
from flask_graphql import GraphQLView

from models import db_session
from schema import schema

app = Flask(__name__)
app.debug = True

app.add_url_rule(
    '/graphql',
    view_func=GraphQLView.as_view(
        'graphql',
        schema=schema,
        graphiql=True, # for having the GraphiQL interface,
        context_value={'session': db_session}
    )
)

@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()

if __name__ == '__main__':
    app.run(debug=True)
