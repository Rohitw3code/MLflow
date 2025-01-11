# 🚀 MLflow.ai - Machine Learning Pipeline Platform

<div align="center">
  <img src="https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_ai.svg" width="200" alt="MLflow Logo"/>

  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

## 📖 About

MLflow.ai is a powerful machine learning pipeline platform that streamlines the process of data preprocessing, model training, and evaluation. Built with modern web technologies, it provides an intuitive interface for data scientists and machine learning engineers to manage their ML workflows efficiently.

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.3
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **UI Components**: Radix UI
- **Code Highlighting**: Prism.js
- **Deployment**: Firebase Hosting

## 🔌 API Structure

### 📊 Data Management API
- `/load` - Load dataset
- `/head` - Get first n rows
- `/tail` - Get last n rows
- `/shape` - Get dataset dimensions
- `/describe` - Get statistical description
- `/info` - Get dataset information
- `/missing` - Get missing values analysis
- `/dataset` - Get complete dataset
- `/column-types` - Get column data types
- `/visualization-data` - Get data for visualizations

### ⚙️ Preprocessing API
- Handle missing values
- Encode categorical variables
- Scale features
- Split dataset
- Delete columns
- Update column types

### 🤖 Model API
- Initialize models
- Train models
- Evaluate performance
- Make predictions

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🌟 Features

- 📈 Interactive data visualization
- 🔄 Real-time data preprocessing
- 🤖 Multiple ML algorithms support
- 📊 Comprehensive model evaluation
- 🎯 Easy-to-use prediction interface
- 💾 Automatic data type detection

## 🔒 Environment Variables

The project uses the following environment variables:
- `VITE_GROQ_API_KEY` - API key for GROQ integration

## 📦 Project Structure

```
src/
├── api/          # API integration
├── config/       # Configuration files
├── hooks/        # Custom React hooks
└── components/   # React components
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">
  Made with ❤️ by the Rohit Kumar
</div>