with open("src/component/learnobjshoe.js", "r") as f:
    text = f.read()

# Replace the Main Content Area positioning so it can be moved. 
# And add the gradient behind it.

old_content = """        {/* Main Content Area */}
        <Box sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "70%",
          marginTop: "10%",
          padding: "4%",
          zIndex: 10000,
          backgroundColor: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(8px)",
          borderRadius: "10px",
          gap: "max(2cqw, 3cqh)"
        }}>"""

new_content = """        {/* Gradient Container behind the blur */}
        <Box
          component="img"
          src={gradient}
          sx={{
            width: "55%",
            height: "40%",
            position: "absolute",
            top: "55%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* Main Content Area */}
        <Box sx={{
          position: "absolute",
          top: "55%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "70%",
          padding: "4%",
          zIndex: 10000,
          backgroundColor: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(8px)",
          borderRadius: "10px",
          gap: "max(2cqw, 3cqh)"
        }}>"""

text = text.replace(old_content, new_content)

with open("src/component/learnobjshoe.js", "w") as f:
    f.write(text)
print("Patched VerifyShoe Backdrop/Gradient!")
