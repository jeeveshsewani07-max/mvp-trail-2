// Export utilities for reports and data

// Format currency in Indian format
export const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
};

// Format date for reports
export const formatReportDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Generate CSV content from data
export const generateCSV = (data: any[], headers: string[]): string => {
  const csvHeaders = headers.join(',');
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header] || '';
      // Escape commas and quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );
  return [csvHeaders, ...csvRows].join('\n');
};

// Download file utility
export const downloadFile = (content: string, filename: string, mimeType: string = 'text/plain') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

// Generate HTML for PDF conversion (browser's print dialog)
export const generateReportHTML = (data: any, title: string): string => {
  const currentDate = formatReportDate(new Date());
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${title}</title>
    <style>
        @media print {
            body { margin: 0; }
            .no-print { display: none !important; }
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #1e40af;
            margin: 0;
        }
        .header p {
            color: #6b7280;
            margin: 5px 0 0 0;
        }
        .section {
            margin-bottom: 30px;
        }
        .section h2 {
            color: #1f2937;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 8px;
            margin-bottom: 16px;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 16px;
            margin-bottom: 20px;
        }
        .stat-card {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 16px;
            text-align: center;
        }
        .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #3b82f6;
        }
        .stat-label {
            font-size: 12px;
            color: #6b7280;
            margin-top: 4px;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
        }
        .table th,
        .table td {
            border: 1px solid #e5e7eb;
            padding: 8px 12px;
            text-align: left;
        }
        .table th {
            background-color: #f3f4f6;
            font-weight: 600;
        }
        .progress-bar {
            background-color: #e5e7eb;
            border-radius: 4px;
            height: 8px;
            overflow: hidden;
        }
        .progress-fill {
            background-color: #3b82f6;
            height: 100%;
            transition: width 0.3s ease;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${title}</h1>
        <p>Generated on ${currentDate}</p>
        <p>Smart Student Hub - Institution Management System</p>
    </div>
    
    <div class="section">
        <h2>Overview Statistics</h2>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${data.overview?.totalStudents || 0}</div>
                <div class="stat-label">Total Students</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${data.overview?.totalFaculty || 0}</div>
                <div class="stat-label">Faculty Members</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${data.overview?.placementRate || 0}%</div>
                <div class="stat-label">Placement Rate</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${data.overview?.averageCGPA || 0}</div>
                <div class="stat-label">Average CGPA</div>
            </div>
        </div>
    </div>
    
    ${data.departmentPerformance ? `
    <div class="section">
        <h2>Department Performance</h2>
        <table class="table">
            <thead>
                <tr>
                    <th>Department</th>
                    <th>Students</th>
                    <th>Faculty</th>
                    <th>Placement Rate</th>
                    <th>Research Output</th>
                    <th>Achievements</th>
                </tr>
            </thead>
            <tbody>
                ${data.departmentPerformance.map((dept: any) => `
                    <tr>
                        <td>${dept.name}</td>
                        <td>${dept.students}</td>
                        <td>${dept.faculty}</td>
                        <td>${dept.placement}%</td>
                        <td>${dept.research}%</td>
                        <td>${dept.achievements}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    ` : ''}
    
    <div class="footer">
        <p>This report was generated by Smart Student Hub Institution Management System</p>
        <p>For more information, please contact your system administrator</p>
    </div>
</body>
</html>
  `;
};

// Export to PDF using browser's print dialog
export const exportToPDF = (data: any, title: string = 'Institution Report') => {
  const htmlContent = generateReportHTML(data, title);
  
  // Open a new window with the HTML content
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load, then trigger print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  }
};

// Export department performance to CSV
export const exportDepartmentCSV = (departments: any[]) => {
  const headers = ['name', 'students', 'faculty', 'achievements', 'placement', 'research', 'satisfaction', 'avgCGPA'];
  const csvContent = generateCSV(departments, headers);
  downloadFile(csvContent, `department_performance_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
};

// Export financial data to CSV
export const exportFinancialCSV = (financialData: any) => {
  const headers = ['department', 'allocated', 'utilized', 'utilization'];
  const csvContent = generateCSV(financialData.departmentAllocation, headers);
  downloadFile(csvContent, `budget_allocation_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
};

// Export achievements data to CSV
export const exportAchievementsCSV = (achievementsData: any) => {
  const headers = ['category', 'count', 'percentage', 'avgCredits'];
  const csvContent = generateCSV(achievementsData.categoryBreakdown, headers);
  downloadFile(csvContent, `achievements_analysis_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
};

// Share via Web Share API or fallback to copy
export const shareReport = async (title: string, text: string, url?: string) => {
  const shareData = {
    title,
    text,
    url: url || window.location.href
  };

  try {
    if (navigator.share && navigator.canShare(shareData)) {
      await navigator.share(shareData);
      return true;
    } else {
      // Fallback: copy to clipboard
      const shareText = `${title}\n\n${text}\n\n${shareData.url}`;
      await navigator.clipboard.writeText(shareText);
      return true;
    }
  } catch (error) {
    console.error('Error sharing:', error);
    return false;
  }
};

// Generate email body for report sharing
export const generateEmailBody = (reportTitle: string, summary: string) => {
  return `Subject: ${reportTitle} - Smart Student Hub

Dear Stakeholder,

Please find the institutional report summary below:

${summary}

Best regards,
Smart Student Hub Administration

---
This is an automated message from Smart Student Hub Institution Management System.
`;
};

// Share report via email
export const shareReportViaEmail = (data: any, title: string) => {
  const summary = `
Report Summary:
- Total Students: ${data.overview?.totalStudents || 0}
- Total Faculty: ${data.overview?.totalFaculty || 0}
- Placement Rate: ${data.overview?.placementRate || 0}%
- Average CGPA: ${data.overview?.averageCGPA || 0}
- Total Achievements: ${data.overview?.totalAchievements || 0}

Generated on: ${formatReportDate(new Date())}
  `.trim();

  const emailBody = generateEmailBody(title, summary);
  const mailto = `mailto:?${encodeURIComponent(emailBody)}`;
  
  window.open(mailto);
};

// Export complete report data as JSON
export const exportCompleteJSON = (data: any, filename: string = 'institution_report') => {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, `${filename}_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
};
