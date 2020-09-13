from bottle import route, run, static_file, request, WSGIRefServer
from threading import Thread
import os, sys

@route('/static/<filename>')
def server_static(filename):
    return static_file(filename, root = os.path.dirname(__file__))

@route('/err', method = 'POST')
def err():
    print(request.json)
    print('shutdown1')
    t = Thread(target=off)
    t.daemon = True
    t.start()

def off():
    server.srv.server_close() 
    server.srv.shutdown()

server = WSGIRefServer(port=8000, host='127.0.0.1')
run(server=server)
sys.exit('error')

