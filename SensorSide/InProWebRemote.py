import httplib
import json
import time


class SensorServer():
    
    def __init__(self):
        
        self.last_command_timestemp = ''
        self.conn = httplib.HTTPConnection("localhost:8080")
        
    def checkForcommand(self):
        
        self.conn.request("GET", "/sensorside/")
        r = self.conn.getresponse()
        texto = r.read()
    
        res = json.loads(texto)
    
        if self.last_command_timestemp == res[1]['datetimestemp']:
            return False, '', ''
        else:
            self.last_command_timestemp = res[1]['datetimestemp']
            return True, res[1]['datetimestemp'],res[0]['last_command']


    def sendData(self, Data):
        
        pass
        
    
    def serverup(self):
        
        while KeyboardInterrupt:
            try:
                status, datetimestemp, last_command = self.checkForcommand()
                if status:
                    print '%s: %s'%(datetimestemp, last_command)
            except:
                print "error in checkForcommand()"
                
            time.sleep(1)


if __name__ == '__main__':
    
    s = SensorServer()
    s.serverup()
    s.conn.close()
    print "conn closed"

    #datetimestemp, last_command = checkForcommand()
    #print '%s: %s'%(datetimestemp, last_command)
    
    
    