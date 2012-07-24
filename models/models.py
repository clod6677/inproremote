#!/usr/bin/env python

from google.appengine.ext import db

# These classes define the data objects
# that you will be able to store in
# AppEngine's data store.


class Transaction(db.Model):
    datetimestemp = db.DateTimeProperty()
    command = db.StringProperty()
    set_params = db.StringProperty()
    get_data = db.StringProperty()

