old_content = """            <Box 
              component="img" 
              sx={{ 
                width: "32%", 
                height: "34%", 
                marginLeft: "33.2%", 
                marginTop: {lg:"-67%",sm:"-148%"},
                position:"absolute",
                zIndex: 1,
              }} 
              src={gradient}
            />"""

new_content = """            {/* Gradient Background Image */}
            <Box 
              component="img" 
              sx={{ 
                position: "absolute",
                width: "45%", 
                height: "40%", 
                top: "55%",
                left: "27.5%",
                zIndex: 1,
                pointerEvents: "none",
              }} 
              src={gradient}
            />"""

with open("src/component/learnobjshoe.js", "r") as f:
    text = f.read()

if old_content in text:
    text = text.replace(old_content, new_content)
    with open("src/component/learnobjshoe.js", "w") as f:
        f.write(text)
    print("Patched VerifyShoe Gradient!")
else:
    print("Could not find old VerifyShoe gradient")
