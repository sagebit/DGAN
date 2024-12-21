from flask import Flask, request, jsonify
from flask_cors import CORS
from pyngrok import ngrok
import base64
import io
from PIL import Image
import numpy as np
import tensorflow as tf

# Terminate existing tunnels
ngrok.kill()

# Create new tunnel
public_url = ngrok.connect(5000)
print(f"Public URL: {public_url}")

app = Flask(__name__)
CORS(app)

@app.route('/process-image', methods=['POST'])
def process_image():
    try:
        # Get the base64 image from the request
        data = request.json
        image_data = data['image'].split(',')[1]
        image_bytes = base64.b64decode(image_data)
        
        # Convert to PIL Image
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to numpy array and normalize
        image_array = np.array(image)
        image_lr = tf.convert_to_tensor(image_array)
        image_lr = tf.image.resize(image_lr, (low_height, low_width))
        image_lr = tf.cast(image_lr, tf.float32)
        image_lr = (image_lr / 127.5) - 1
        image_lr = tf.expand_dims(image_lr, 0)
        
        # Process with your model
        fake_lr, fake_hr = generator(image_lr, training=False)
        
        # Convert back to image
        processed_image = fake_hr[0] * 0.5 + 0.5
        processed_image = tf.cast(processed_image * 255, tf.uint8)
        processed_image = Image.fromarray(processed_image.numpy())
        
        # Convert to base64
        buffered = io.BytesIO()
        processed_image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        
        return jsonify({
            'processedImage': f'data:image/png;base64,{img_str}'
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run()