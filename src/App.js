import React, { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import Drawing from "./component/Drawing";
import PredictionChart from "./component/PredictionChart"; // Yeni bileşeni import edin
import { BsArrowCounterclockwise } from "react-icons/bs";
import CustomTooltip from "./component/Tooltip";
import { loadFull } from "tsparticles";
import particlesOptions from "./assest/json/particles.json";
import { initParticlesEngine } from "@tsparticles/react";
import Particles from "./component/Particles";

const classifierUrl = `${window.location.origin}/DrawPredict/classifiers/model.json`;

const loadModel = async () => {
  try {
    const model = await tf.loadLayersModel(classifierUrl);
    return model;
  } catch (error) {
    console.error("Error loading model:", error);
  }
};

const App = () => {
  const [strokes, setStrokes] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [predictionProbabilities, setPredictionProbabilities] = useState([]); // Tüm olasılıkları saklayacak
  const [model, setModel] = useState(null);
  const canvasRef = useRef(null);

  const [init, setInit] = useState(false);

  useEffect(() => {
    if (init) {
      return;
    }

    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  useEffect(() => {
    loadModel().then(setModel);
  }, []);

  const isCanvasEmpty = (canvas) => {
    const ctx = canvas.getContext("2d");
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    return pixels.every((pixel) => pixel === 255); // Tüm pikseller beyaz mı
  };

  const endStroke = async () => {
    const canvas = canvasRef.current;

    if (isCanvasEmpty(canvas)) return; // Kanvas boşsa işlevden çık

    setIsDrawing(false);

    const imgData = canvas.toDataURL("image/png");

    const img = new Image();
    img.src = imgData;

    img.onload = async () => {
      const tensor = tf.browser
        .fromPixels(img)
        .toFloat()
        .resizeNearestNeighbor([28, 28])
        .mean(2)
        .expandDims(0)
        .expandDims(-1)
        .div(255.0);

      if (model) {
        const predictions = await model.predict(tensor).data();
        const topPrediction = predictions.indexOf(Math.max(...predictions));

        setPrediction(topPrediction);
        setPredictionProbabilities(predictions);
      }
    };
  };

  const clearCanvas = () => {
    setStrokes([]);
    setPrediction(null);
    setPredictionProbabilities(Array(10).fill(0)); // Varsayılan sıfırlarla doldur
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="container ">
      <Particles options={particlesOptions} />

      <div className="row">
        <div className="title ">
          <h1>React JS ile El Yazısı Tanıma</h1>
          <p>
            React JS kullanarak el yazısını tanıyan bir uygulama. Bir sayı (0-9)
            çizin ve modelin tahminini görün!
          </p>
        </div>
        <div className="info">
          <h3 className="">
            {prediction != null
              ? `Tahmin: ${prediction} (${(
                  predictionProbabilities[prediction] * 100
                ).toFixed(2)}%)`
              : "Bir sayı (0-9) çizin"}
          </h3>
          <CustomTooltip
            content="Modeli Sıfırla"
            position="top"
            color="#fff"
            backgroundColor="#000"
            borderRadius="8px"
            fontSize="12px"
          >
            <BsArrowCounterclockwise
              className="return-icon shadow"
              onClick={clearCanvas}
            />
          </CustomTooltip>
        </div>
        <Drawing
          strokes={strokes}
          isDrawing={isDrawing}
          addStroke={(point) => {
            setStrokes([...strokes, [point]]);
            setIsDrawing(true);
          }}
          addStrokePos={(point) => {
            if (isDrawing) {
              setStrokes(
                strokes.map((stroke, idx) =>
                  idx === strokes.length - 1 ? [...stroke, point] : stroke
                )
              );
            }
          }}
          endStroke={endStroke}
          canvasRef={canvasRef}
        />
        <PredictionChart
          predictions={
            predictionProbabilities.length > 0
              ? predictionProbabilities
              : Array(10).fill(0)
          }
        />
      </div>
    </div>
  );
};

export default App;
