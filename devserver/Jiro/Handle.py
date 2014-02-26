import webapp2
import API


app = webapp2.WSGIApplication([
              ('/jirohandle/([^/]+)/([^/]+)/?', API.Engine.handler)
          ], debug=True)