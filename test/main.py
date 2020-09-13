from bottle import route, run, static_file, request, WSGIRefServer
from threading import Thread
import os, sys

EXIT_CODE = 0

@route('/static/<path:path>')
def server_static(path):
    root = os.path.dirname(__file__)
    if path == 'rs_require.js':
        root = os.path.join(root, '../')
    return static_file(path, root = root)

@route('/done', method = 'POST')
def done():
    print(request.json)
    stop()

@route('/err', method = 'POST')
def err():
    global EXIT_CODE
    print(request.json)
    EXIT_CODE = 1
    stop()
    
def stop():
    t = Thread(target=off)
    t.daemon = True
    t.start()

def off():
    server.srv.server_close() 
    server.srv.shutdown()

server = WSGIRefServer(port=8000, host='127.0.0.1')
run(server=server)
sys.exit(EXIT_CODE)

