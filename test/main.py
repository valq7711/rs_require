from bottle import route, run, static_file, request, WSGIRefServer
#from threading import Thread
import os, sys

@route('/static/<filename>')
def server_static(filename):
    return static_file(filename, root = os.path.dirname(__file__))

@route('/err', method = 'POST')
def err():
    print(request.json)
    print('shutdown1')
    #sys.exit()
    raise KeyboardInterrupt() #SystemExit('error')
    

server = WSGIRefServer(port=8000, host='127.0.0.1')

def run_srv():
    try:
        run(server=server)
    except Exception:
        pass
    server.srv.server_close() 
    server.srv.shutdown()
    print('shutdown')
    

run_srv()
sys.exit('error')

#t = Thread(target=run_srv)
#t.daemon = True
#t.start()
#t.join()
#sys.exit('error')

