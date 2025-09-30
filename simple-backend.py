#!/usr/bin/env python3
"""
Simple Python Backend for DishCompare Testing
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse
from datetime import datetime

class DishCompareHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/health':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {
                "status": "OK",
                "message": "DishCompare Backend is running!",
                "timestamp": datetime.now().isoformat()
            }
            self.wfile.write(json.dumps(response).encode())
            
        elif self.path == '/api/auth/google':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {
                "message": "Gmail OAuth endpoint - would redirect to Google",
                "url": "https://accounts.google.com/oauth/authorize"
            }
            self.wfile.write(json.dumps(response).encode())
            
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_POST(self):
        if self.path == '/api/auth/register/phone':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {
                "message": "OTP sent to phone number",
                "phone": data.get('phone', ''),
                "otp": "123456"  # Mock OTP for testing
            }
            self.wfile.write(json.dumps(response).encode())
            
        elif self.path == '/api/auth/verify/phone':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            if data.get('otp') == '123456':
                response = {
                    "message": "Phone verified successfully",
                    "user": {
                        "id": 12345,
                        "name": "Test User",
                        "phone": data.get('phone', '')
                    }
                }
            else:
                response = {
                    "message": "Invalid OTP"
                }
            
            self.wfile.write(json.dumps(response).encode())
            
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

if __name__ == '__main__':
    server = HTTPServer(('localhost', 3001), DishCompareHandler)
    print("🚀 Python Backend running on http://localhost:3001")
    print("📱 Health Check: http://localhost:3001/api/health")
    print("Press Ctrl+C to stop")
    server.serve_forever()
