from bottle import route, run, static_file, request, WSGIRefServer
from threading import Thread
import os, sys

@route('/static/<filename>')
def server_static(filename):
    return static_file(filename, root = os.path.dirname(__file__))

@route('/err', method = 'POST')
def err():
    print(request.json)
    shutdown()
    
def shutdown():
    server.srv.server_close() 
    server.srv.shutdown()
    

server = WSGIRefServer(port=8000, host='127.0.0.1')

def run_srv():
    run(server=server)
    print('shutdown')

t = Thread(target=run_srv)
t.daemon = True
t.start()
t.join()
sys.exit('error')

