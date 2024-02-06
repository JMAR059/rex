
def whiteSpaceHandler( line: str ) -> str:

    cleaned = ""

    previousWasSpace = False
    for char in line:

        if not(previousWasSpace and char == ' '):
            cleaned += char

        previousWasSpace = True if char == ' ' else False

    return cleaned


def rexSplitLine( line: str ) -> [str]:

    cleaned = whiteSpaceHandler(line)

    return cleaned.split(sep=' ')



if __name__ == "__main__":

    testLine = "R X S X A"

    print("Here is the current line: " + testLine)

    whiteSpaceResult = whiteSpaceHandler(testLine)

    print("Here is what it is now: " + whiteSpaceResult)

    fullResult = rexSplitLine(testLine)

    print("Now here is what we have with the full process: " + str(fullResult))






