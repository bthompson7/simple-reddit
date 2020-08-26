'''

handles server side input validation

'''

import re

class Validation:

    def __init__(self):
        pass

    '''
    check if username is valid
    '''
    def isUsernameValid(self,username):
        validUsername = "[a-zA-Z0-9]+"
        input1 = re.search(validUsername, username)
        print(input1)
        if input1:
            print("good username")
            return True
        else:
            return False

    '''
    check if input(text in this case) is valid
    '''
    def isInputValid(self,text):
        validText = "^[(?!',.:;/)*a-zA-Z(0-9) ]+$"
        input2 = re.search(validText, text)
        if input2:
            return True
        else:
            return False

    '''
    check if a link is valid
    '''
    def isLinkValid(self,link):
        validLink = "^[http://|https://]{1}[www.]?[a-zA-Z0-9]+.[a-zA-Z0-9]+"
        input3 = re.search(validLink,link)
        if input3:
            return True
        else:
            return False
                
