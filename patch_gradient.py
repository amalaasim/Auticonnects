with open("src/component/learnobjshoe.js", "r") as f:
    text = f.read()

# Replace the gradient in UploadShoe so it can move down
old_gradient = """          {/* Gradient Container */}
          <Box
            component="img"
            src={gradient}
            sx={{
              width: "55%",
              height: "40%",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -10%)",
              zIndex: 2,
              pointerEvents: "none",
            }}
          />"""

new_gradient = """          {/* Gradient Container */}
          <Box
            component="img"
            src={gradient}
            sx={{
              width: "80%",
              height: "45%",
              position: "absolute",
              top: "60%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 2,
              pointerEvents: "none",
            }}
          />"""

text = text.replace(old_gradient, new_gradient)

with open("src/component/learnobjshoe.js", "w") as f:
    f.write(text)
print("Patched UploadShoe Gradient!")
