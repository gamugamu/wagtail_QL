FROM gcr.io/google_appengine/python
RUN virtualenv /env

# source venv/bin/activate
ENV VIRTUAL_ENV /env
ENV PATH /env/bin:$PATH

ADD requirements.txt /app/requirements.txt
RUN pip install -r /app/requirements.txt

# no database - SQL only
#ENV NODB 1

ADD . /app

CMD export GCLOUD_PROJECT=fire-193914
CMD gunicorn -b :$PORT wsgi:app
