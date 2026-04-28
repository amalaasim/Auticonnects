import subprocess

out = subprocess.check_output(["git", "diff", "src/component/learnobjshoe.js"], text=True)

# Find removed images
lines = out.split('\n')
for line in lines:
    if line.startswith('- ') and 'src={' in line:
        print(line)
