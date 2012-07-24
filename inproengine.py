
import os
#from datetime import datetime
import webapp2
import json
from google.appengine.ext.webapp import template
#from config import config
#from controllers import crons
#from controllers import ajaxcontrol
from datetime import datetime, timedelta

from models.models import Transaction
#import json
#from distutils.cmd import Command

#os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'
#
#from google.appengine.dist import use_library
#use_library('django', '1.3')

#to release socket
# fuser -k 8080/tcp
#to check socket
# lsof -i :8080


class Remote(webapp2.RequestHandler):

    def get(self):

        path = os.path.join(os.path.dirname(__file__), 'remote.html')

        self.response.out.write(template.render(path, {}))

    def post(self):
        
        command_request = self.request.POST.get('command')
        
        trans = Transaction()
        
        trans.command = command_request
        trans.datetimestemp = datetime.now()
        trans.put()
        
        
        
class SensorSide(webapp2.RequestHandler):
    
    def get(self):
        
        #path = os.path.join(os.path.dirname(__file__), 'sensorside.html')
        
        query_command = Transaction.gql("WHERE datetimestemp>:dt ORDER BY datetimestemp DESC",
                                             dt=(datetime.now() - timedelta(hours=1)))
                
        last_command = query_command.fetch(limit=1)[0]
        
        
        jsonStr = json.dumps([{"last_command": last_command.command},
                              {"datetimestemp": str(last_command.datetimestemp)},
                              ])
        
        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(jsonStr)


class MainPage(webapp2.RequestHandler):

    def get(self):

        path = os.path.join(os.path.dirname(__file__), 'index.html')

        self.response.out.write(

                template.render(path, {
                    #"title": config.scriptTitle,
                    #"year": datetime.now().strftime("%Y"),
                    #"template_values": template_values,
        }))

app = webapp2.WSGIApplication([
                               ('/', MainPage),
                               #('/crons/5min/', crons.ParseForNewData),
                               #('/getdata/', ajaxcontrol.Jam),
                               #('/getdatasouth/', ajaxcontrol.JamDirectionSouth),
                               #('/getdatanorth/', ajaxcontrol.JamDirectionNorth),
                               ('/remote/', Remote),
                               ('/sensorside/', SensorSide),
                               ])

