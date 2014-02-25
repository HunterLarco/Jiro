

# 8 character hash
def custom(string):
  # begin ToHex function
  def ToHex(num):
    hexValue = '%x' % num
    modV = len(hexValue) % 4
    if modV != 0:
      for i in range(4-modV):
        hexValue = "0" + hexValue
    return hexValue
  # end ToHex function
  
  # pack into a multiple of 32
  packing = 32 - len(string) % 32
  for i in range(packing):
    string += chr(0)
  
  # primes
  primes = [5381, 2129]
  
  # iterate through "chunks"/multiples of 32 characters
  for j in range(len(string)/32):
    piece = string[j*32:(j+1)*32]
    for i in range(len(piece)/16):
      pi = i % len(primes)
      subString = piece[i*16:(i+1)*16]
      for k in range(len(subString)):
        char = ord(subString[k])
        # 16777215 is VBS max int value is 0xffffff --- thus this sub-hash is always a maximum of 6-digits
        primes[pi] = (primes[pi] * (32) + primes[pi] + char) & 0xffff
  return ''.join([ToHex(x) for x in primes])





def sha256(string=""):
  import hashlib
  return hashlib.sha256(string).hexdigest()