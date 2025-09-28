import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    /* Primary Colors - Deep Ocean */
    --color-background: #0A0E18;
    --color-background-lighter: #1A1F2E;
    
    /* Secondary/Accent Colors - Aqua Blue */
    --color-accent: #00FFFF;
    --color-accent-rich: #4BCFEA;
    
    /* Liquid Glass Effects */
    --glass-background: rgba(255, 255, 255, 0.05);
    --glass-background-accent: rgba(0, 255, 255, 0.05);
    --glass-border: 1px solid rgba(75, 207, 234, 0.3);
    --glass-glow: 0 0 10px rgba(0, 255, 255, 0.2);
    
    /* Feedback Colors */
    --color-success: #00E676;
    --color-error: #FF5252;
    
    /* Typography */
    --font-primary: 'Inter', 'Poppins', 'Roboto', sans-serif;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: var(--font-primary);
    background-color: var(--color-background);
    color: white;
    overflow-x: hidden;
    min-height: 100vh;
  }

  /* Liquid Glass Component Base Styles */
  .glass-container {
    background: var(--glass-background);
    backdrop-filter: blur(12px);
    border: var(--glass-border);
    box-shadow: var(--glass-glow);
    border-radius: 12px;
    transition: all 0.3s ease;
  }

  .glass-container:hover {
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
  }

  /* Button Base Styles */
  .btn {
    font-family: var(--font-primary);
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    outline: none;
    position: relative;
    overflow: hidden;
  }

  .btn:hover {
    transform: translateY(-2px);
  }

  .btn-primary {
    background-color: var(--color-accent-rich);
    color: white;
    box-shadow: 0 0 10px rgba(75, 207, 234, 0.4);
  }

  .btn-primary:hover {
    box-shadow: 0 0 15px rgba(75, 207, 234, 0.6);
  }

  .btn-secondary {
    background-color: transparent;
    color: var(--color-accent);
    border: 1px solid var(--color-accent);
    box-shadow: 0 0 5px rgba(75, 207, 234, 0.2);
  }

  .btn-secondary:hover {
    background-color: rgba(75, 207, 234, 0.1);
    box-shadow: 0 0 10px rgba(75, 207, 234, 0.4);
  }
`;

export default GlobalStyles;