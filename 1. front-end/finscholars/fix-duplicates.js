// Fix for duplicate modules in module.html
document.addEventListener('DOMContentLoaded', function() {
  // Function to remove duplicate submodules
  function removeDuplicateModules() {
    // Get all submodule buttons
    const submoduleButtons = document.querySelectorAll('.submodule-button');
    const processedIds = new Set();
    
    // Check each button
    submoduleButtons.forEach(button => {
      const moduleId = button.getAttribute('data-id');
      
      // If we've seen this ID before, remove the duplicate
      if (moduleId && processedIds.has(moduleId)) {
        button.remove();
      } else if (moduleId) {
        // Otherwise, mark this ID as processed
        processedIds.add(moduleId);
      }
    });
    
    console.log('Duplicate module check complete');
  }
  
  // Implement the missing addSubmoduleToList function
  window.addSubmoduleToList = function(submodule, index) {
    console.log('Adding submodule to list:', submodule);
    
    // Get the submodule list element
    const submoduleList = document.getElementById('submodule-list');
    if (!submoduleList) {
      console.error('Submodule list element not found');
      return;
    }
    
    // Create a new button for the submodule
    const button = document.createElement('button');
    button.className = 'submodule-button';
    button.setAttribute('data-id', submodule.id || `submodule-${index}`);
    button.setAttribute('data-index', index);
    
    // Set the button text to the submodule title
    button.textContent = submodule.title || `Submodule ${index + 1}`;
    
    // Add click event to show the corresponding submodule content
    button.addEventListener('click', function() {
      // Hide all submodule content
      document.querySelectorAll('.submodule-content').forEach(content => {
        content.style.display = 'none';
      });
      
      // Show the selected submodule content
      const submoduleContent = document.querySelector(`.submodule-content[data-index="${index}"]`);
      if (submoduleContent) {
        submoduleContent.style.display = 'block';
      }
      
      // Update active button styling
      document.querySelectorAll('.submodule-button').forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');
    });
    
    // Add the button to the submodule list
    submoduleList.appendChild(button);
  };
  
  // Patch the original initializeModule function to prevent errors
  const originalInitModule = window.initializeModule;
  if (typeof originalInitModule === 'function') {
    window.initializeModule = function(moduleId) {
      try {
        // Create missing elements if needed
        const elements = ['module-title', 'module-description', 'submodule-list', 'content-container'];
        elements.forEach(id => {
          if (!document.getElementById(id)) {
            console.log(`Creating missing element: ${id}`);
            const div = document.createElement('div');
            div.id = id;
            document.body.appendChild(div);
          }
        });
        
        // Call original with error handling
        originalInitModule(moduleId);
      } catch (error) {
        console.error('Error in module initialization:', error);
        // Show error message to user
        document.body.innerHTML = `
          <div style="text-align: center; margin-top: 50px; color: white;">
            <h2>Module could not be loaded</h2>
            <p>Please try refreshing the page or return to the dashboard.</p>
            <a href="dashboard.html" style="color: #4bcfea; text-decoration: underline;">Return to Dashboard</a>
          </div>
        `;
      }
    };
  }
  
  // Run the duplicate removal every second to catch any dynamically added modules
  setInterval(removeDuplicateModules, 1000);
  
  // Also run immediately
  setTimeout(removeDuplicateModules, 500);
});