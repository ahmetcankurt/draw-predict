import * as tf from "@tensorflow/tfjs";

export default class HandwritingDigitsClassifier {
  static CLASSIFIER_FOLDER = "classifiers";
  static CLASSIFIER_NAME = "model";

  constructor() {
    this.loadModel();
  }

  async loadModel() {
    try {
      const { host, protocol } = window.location;
      this.model = await tf.loadLayersModel(
        `${protocol}//${host}/${HandwritingDigitsClassifier.CLASSIFIER_FOLDER}/${HandwritingDigitsClassifier.CLASSIFIER_NAME}.json`
      );
      console.log("Model loaded successfully");
    } catch (error) {
      console.error("Error loading model:", error);
    }
  }
  
  predict(dataTensor) {
    return tf.tidy(() => {
      const output = this.model.predict(dataTensor);
      const axis = 1;
      const predictions = Array.from(output.argMax(axis).dataSync());
      console.log("Model output:", output);
      console.log("Predictions:", predictions);
      return predictions[0]; // En yüksek olasılığa sahip sınıfı döndür
    });
  }
}

