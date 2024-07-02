from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from scapy.all import rdpcap
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

def parse_pcap(file_path):
    packets = rdpcap(file_path)
    packet_data = []

    for packet in packets:
        # Check if the packet has the necessary layers
        if packet.haslayer('IP'):
            packet_info = {
                'src': packet['IP'].src,
                'dst': packet['IP'].dst,
                'protocol': packet['IP'].proto,
                'time': packet.time,
            }
            packet_data.append(packet_info)
        else:
            # Handle other layers or log packet with missing layers
            print(f"Packet does not have an IP layer: {packet.summary()}")
    
    return packet_data

@app.route('/upload', methods=['POST'])
def upload_pcap():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    file_path = os.path.join('./', file.filename)
    file.save(file_path)

    packet_data = parse_pcap(file_path)
    return jsonify({'data': packet_data})

@app.route('/visualize', methods=['POST'])
def visualize_data():
    data = request.json.get('data', [])
    df = pd.DataFrame(data)
    
    df['time'] = pd.to_datetime(df['time'], unit='s')
    df.set_index('time', inplace=True)
    df['count'] = 1
    visualization_data = df.resample('T').count()['count'].tolist()
    
    return jsonify({'visualization_data': visualization_data})

@app.route('/detect', methods=['POST'])
def detect_anomalies():
    data = request.json.get('data', [])

    # Example ML model integration
    # Replace this with your actual model loading and prediction code
    model = load_your_model()  # Implement this function
    features = extract_features(data)  # Implement this function
    predictions = model.predict(features)
    
    anomalies = [bool(pred) for pred in predictions]

    if any(anomalies):
        return jsonify({'message': 'Anomalies detected', 'anomalies': anomalies})
    
    return jsonify({'message': 'No anomalies detected', 'anomalies': anomalies})


if __name__ == '__main__':
    app.run(debug=True, port=5001)

