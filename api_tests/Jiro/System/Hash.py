def sha256(string=""):
  import hashlib
  return hashlib.sha256(string).hexdigest()


def sha224(string=""):
  import hashlib
  return hashlib.sha224(string).hexdigest()