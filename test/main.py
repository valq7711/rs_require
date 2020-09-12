from bottle import route, run, static_file, request, WSGIRefServer
from threading import Thread
import os

@route('/static/<filename>')
def server_static(filename):
    return static_file(filename, root = os.path.dirname(__file__))

@route('/err', method = 'POST')
def err():
    print(request.json)
    Thread(target=shutdown).start()

def shutdown():
    print('shutdown')
    server.srv.shutdown()

server = WSGIRefServer(port=80)
run(server=server, host='127.0.0.1', port=8000, debug=True)
