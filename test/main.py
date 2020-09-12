from bottle import route, run, static_file, request, WSGIRefServer
from threading import Thread
import os, sys

@route('/static/<filename>')
def server_static(filename):
    return static_file(filename, root = os.path.dirname(__file__))

@route('/err', method = 'POST')
def err():
    print(request.json)
    Thread(target=shutdown).start()

def shutdown():
    print('shutdown')
    server.srv.server_close() 
    server.srv.shutdown()
    sys.exit('error')

server = WSGIRefServer(port=8000, host='127.0.0.1')
run(server=server, debug=True)
