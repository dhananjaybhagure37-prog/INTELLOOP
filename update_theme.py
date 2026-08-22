import re

with open('login.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Body background
content = content.replace('background-color: #e0e0e0;', 'background-color: #0c1324;\n      background-image: radial-gradient(circle at center, #151b2d 0%, #0c1324 100%);')

# Center Card
content = content.replace('background-image: linear-gradient(to top right, #f9a743, #f9db5f);', 'background-color: rgba(25, 31, 49, 0.6);\n      backdrop-filter: blur(16px);\n      border: 1px solid rgba(173, 198, 255, 0.15);\n      box-shadow: 0 10px 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(173, 198, 255, 0.05);')
content = content.replace('border-radius: 3px;', 'border-radius: 24px;')

# Ears (Antennas)
content = content.replace('background-color: #243946;', 'background-color: transparent;\n      border: 3px solid rgba(173, 198, 255, 0.3);\n      box-shadow: 0 0 20px rgba(173, 198, 255, 0.2), inset 0 0 20px rgba(173, 198, 255, 0.1);', 1)

# Eyes (LEDs)
content = content.replace('background-color: #243946;', 'background-color: #00e5ff;\n      box-shadow: 0 0 15px #00e5ff, 0 0 25px #00e5ff;', 1)

# Nose Glow
content = content.replace('background-color: #476375;', 'background-color: #adc6ff;\n      box-shadow: 0 0 10px #adc6ff;')
content = content.replace('fill="#243946"', 'fill="#adc6ff"')

# Mouth
content = content.replace('stroke: #243946;', 'stroke: #adc6ff;\n      filter: drop-shadow(0 0 5px #adc6ff);')
content = content.replace('background-color: #243946;', 'background-color: #070d1f;\n      border-bottom: 2px solid #adc6ff;\n      box-shadow: inset 0 5px 10px rgba(0,0,0,0.8);', 1) # For mouth hole

# Tongue
content = content.replace('background-color: #ffd7dd;', 'background-color: rgba(221, 183, 255, 0.9);\n      box-shadow: 0 5px 15px rgba(221, 183, 255, 0.4);', 1)
content = content.replace('background-color: #ffd7dd;', 'background-color: rgba(221, 183, 255, 0.9);', 1) # tongue top
content = content.replace('background-color: #fcb7bf;', 'background-color: #a855f7;', 1) # line
content = content.replace('background-color: #fcb7bf;', 'background-color: #a855f7;', 1) # median

# Hands
content = content.replace('border: 2px solid #243946;', 'border: 2px solid #adc6ff;')
content = content.replace('border: 2px solid #243946;', 'border: 2px solid #adc6ff;')
content = content.replace('background-color: #fac555;', 'background-color: #151b2d;\n      box-shadow: inset 0 0 8px rgba(173, 198, 255, 0.3);', 1) # bone
content = content.replace('background-color: #fac555;', 'background-color: #151b2d;', 1) # nail

# Form Elements
content = content.replace('color: #bbb;', 'color: #adc6ff;\n      text-shadow: 0 0 5px rgba(173, 198, 255, 0.5);')

# Input Fields
input_css = '''padding: 0 20px 0 40px;
      margin: 5px 0;
      box-shadow: none;
      outline: none;'''
new_input_css = '''padding: 0 20px 0 40px;
      margin: 5px 0;
      outline: none;
      background: rgba(173, 198, 255, 0.05);
      border: 1px solid rgba(173, 198, 255, 0.2);
      color: #dce1fb;
      box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);
      transition: all 0.3s;
    }
    .center .login input:focus {
      border-color: #adc6ff;
      box-shadow: 0 0 10px rgba(173, 198, 255, 0.2), inset 0 2px 5px rgba(0,0,0,0.2);'''
content = content.replace(input_css, new_input_css)

content = content.replace('color: #ccc;', 'color: rgba(220, 225, 251, 0.4);')

# Password Button
pass_btn_css = '''background-color: #243946;
      color: white;'''
new_pass_btn_css = '''background-color: rgba(173, 198, 255, 0.1);
      border: 1px solid rgba(173, 198, 255, 0.3);
      color: #adc6ff;
      backdrop-filter: blur(4px);
      transition: all 0.2s;'''
content = content.replace(pass_btn_css, new_pass_btn_css)

# Login Button
login_btn_css = '''background-color: #243946;
      color: white;'''
new_login_btn_css = '''background: linear-gradient(135deg, #4d8eff 0%, #6f00be 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(77, 142, 255, 0.4);
      font-weight: bold;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
      border: none;'''
content = content.replace(login_btn_css, new_login_btn_css)

# Social Buttons
social_btn_css = '''background-color: #243946;
      color: white;'''
new_social_btn_css = '''background-color: rgba(173, 198, 255, 0.1);
      border: 1px solid rgba(173, 198, 255, 0.3);
      color: #adc6ff;
      backdrop-filter: blur(4px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      transition: all 0.3s;
    }
    .center .social-buttons .social:hover {
      background-color: rgba(173, 198, 255, 0.2);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(173, 198, 255, 0.2);'''
content = content.replace(social_btn_css, new_social_btn_css)

# Footer & Overlay
content = content.replace('color: #666;', 'color: rgba(140, 144, 159, 0.8);\n      letter-spacing: 0.5px;')
content = content.replace('background: rgba(224, 224, 224, 0.8);', 'background: rgba(12, 19, 36, 0.9);')
content = content.replace('color: #243946;', 'color: #adc6ff;')

with open('login.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated login.html")
