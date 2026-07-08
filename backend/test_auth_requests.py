import json
import urllib.request
import urllib.error

BASE='http://127.0.0.1:8000/api/v1'

def post(path, payload):
    url = f"{BASE}{path}"
    data = json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data, headers={'Content-Type':'application/json'})
    try:
        resp = urllib.request.urlopen(req, timeout=10)
        body = resp.read().decode()
        print('OK', resp.status, body)
        return resp.status, body
    except urllib.error.HTTPError as e:
        try:
            print('HTTP ERROR', e.code, e.read().decode())
        except Exception:
            print('HTTP ERROR', e.code)
        return e.code, None
    except Exception as e:
        print('ERROR', e)
        return None, None

if __name__ == '__main__':
    reg_payload = {'name': 'Test User', 'email': 'tester+1@example.com', 'password': 'password123'}
    print('Registering...')
    post('/auth/register', reg_payload)

    login_payload = {'email': 'tester+1@example.com', 'password': 'password123'}
    print('Logging in...')
    post('/auth/login', login_payload)
