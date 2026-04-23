import Navbar from "../components/Navbar";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale);

export default function Insights() {

  // Sample data (for demonstration)
  const sampleData = {
    Normal: 0.05,
    Doubtful: 0.10,
    Mild: 0.25,
    Moderate: 0.45,
    Severe: 0.15
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="p-8">

        {/* Title */}
        <h2 className="text-3xl font-bold mb-4">
          AI Insights & Model Explanation
        </h2>

        <p className="text-gray-600 mb-8">
          Understand how the AI model evaluates knee X-ray images and determines osteoporosis severity.
        </p>

        {/* Chart Section */}
        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h3 className="text-lg font-semibold mb-4">
            Sample Prediction Probability Distribution
          </h3>

          <Bar
            data={{
              labels: Object.keys(sampleData),
              datasets: [
                {
                  label: "Probability",
                  data: Object.values(sampleData),
                },
              ],
            }}
          />
        </div>

        {/* Severity Legend */}
        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h3 className="text-lg font-semibold mb-4">
            Severity Levels
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">

            <div className="p-3 rounded bg-green-100 text-green-700 text-center">
              Normal
            </div>

            <div className="p-3 rounded bg-yellow-100 text-yellow-700 text-center">
              Doubtful
            </div>

            <div className="p-3 rounded bg-orange-100 text-orange-700 text-center">
              Mild
            </div>

            <div className="p-3 rounded bg-orange-300 text-orange-900 text-center">
              Moderate
            </div>

            <div className="p-3 rounded bg-red-100 text-red-700 text-center">
              Severe
            </div>

          </div>
        </div>

        {/* Explanation Section */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">
            How the AI Model Works
          </h3>

          <ul className="list-disc pl-5 text-gray-600 space-y-2 text-sm">
            <li>The model processes knee X-ray images in grayscale format.</li>
            <li>Images are resized to 256×256 pixels before analysis.</li>
            <li>A deep learning model detects bone density patterns.</li>
            <li>The output is a probability distribution across 5 classes.</li>
            <li>The highest probability determines the final prediction.</li>
          </ul>
        </div>

      </div>
    </div>
  );
}