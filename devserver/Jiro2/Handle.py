import webapp2
import Net
import API




class Handler(webapp2.RequestHandler):
  def get(self):
    """
    
    PURPOSE: serves the JiroJS client
    
    """
    self.response.headers['Content-Type'] = "application/javascript"
    self.response.out.write(Net.JiroJS.serve(self.request.path))
  
  
  def post(self):
    """
    
    PURPOSE: access point for all API functionality
    
    """
    self.response.out.write(API.Engine.delegate(self.request))





app = webapp2.WSGIApplication([
              ('.*', Handler)
          ], debug=True)