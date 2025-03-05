import { NextResponse } from 'next/server';

// Claude API client
async function callClaudeAPI(prompt: string) {
  try {
    // You'll need to set up your Claude API key in your environment variables
    const apiKey = process.env.CLAUDE_API_KEY;
    
    if (!apiKey) {
      throw new Error('Claude API key is not configured');
    }

    // Create a structured prompt that asks for JSON response
    const structuredPrompt = `${prompt}

Please respond with a valid JSON object that contains the following fields:
1. "costSavings": A string with the estimated annual cost savings (e.g., "$50,000 - $100,000")
2. "revenueSavings": A string with the estimated annual revenue gains (e.g., "$75,000 - $150,000")
3. "summary": A concise 1-2 paragraph summary of the ROI analysis
4. "fullAnalysis": A detailed explanation of how you arrived at these figures

The JSON should be properly formatted and parseable. Example format:
{
  "costSavings": "$X - $Y",
  "revenueSavings": "$A - $B",
  "summary": "Brief explanation...",
  "fullAnalysis": "Detailed analysis..."
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content: structuredPrompt
          }
        ],
        system: "You are an expert financial analyst specializing in ROI calculations for AI and automation tools. Provide realistic, data-driven estimates in JSON format."
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Claude API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw error;
  }
}

// Parse Claude's JSON response
function parseClaudeResponse(response: string) {
  try {
    // Extract JSON from the response
    // Sometimes Claude might wrap the JSON in markdown code blocks or add explanatory text
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || 
                      response.match(/```\s*([\s\S]*?)\s*```/) ||
                      response.match(/(\{[\s\S]*\})/);
    
    let jsonStr = jsonMatch ? jsonMatch[1] : response;
    
    // Clean up any potential markdown or text around the JSON
    jsonStr = jsonStr.trim();
    
    // Parse the JSON
    const parsedData = JSON.parse(jsonStr);
    
    return {
      costSavings: parsedData.costSavings || 'Not available',
      revenueSavings: parsedData.revenueSavings || 'Not available',
      explanation: parsedData.summary || 'Not available',
      fullAnalysis: parsedData.fullAnalysis || 'Not available'
    };
  } catch (error) {
    console.error('Error parsing Claude JSON response:', error);
    // Return default values if parsing fails
    return {
      costSavings: 'Not available',
      revenueSavings: 'Not available',
      explanation: 'Unable to parse the response. Please try again.',
      fullAnalysis: response // Return the raw response for debugging
    };
  }
}

export async function POST(request: Request) {
  try {
    const { teamSize, supportTeamSize, revenue } = await request.json();

    // Validate inputs
    if (!teamSize || !supportTeamSize) {
      return NextResponse.json(
        { error: 'Team size and support team size are required' },
        { status: 400 }
      );
    }

    // Construct the prompt for Claude
    const prompt = `Given:
- A company with ${teamSize} employees
- A support team of ${supportTeamSize} people
- ${revenue ? `Annual revenue of $${revenue}` : '(Revenue not provided)'}

Estimate:
1. Annual **cost savings** from AI automation. This happens through - 
a) Reduction in support workload
b) Elimination or reduction in manual tracking
c) Reduced time in operational workflows such as updating internal tools 
d) Reduction in need for hiring. Teams can scale and handle additional support without having to linearly increase headcount.

2. Annual **revenue gains** from - 
a) Quicker tracking of issues leading to faster iteration cycles (keep in mind majority of the work is product development but we can connect the customer to the team faster)
b) Quicker delivery of product and revenue insights from customer touchpoints and channels 
c) Improved customer satisfaction from faster and higher quality responses

Given that headcount reduction maybe one of the bigger benefits dollar wise, usually cost savings will be higher than revenue gains. If that's not the case, then make sure your reasoning is right as there could be exceptions.

If revenue is **not provided**, estimate it based on the team size using typical benchmarks.`;

    // Call Claude API
    try {
      const claudeResponse = await callClaudeAPI(prompt);
      const parsedResponse = parseClaudeResponse(claudeResponse);
      
      return NextResponse.json({
        costSavings: parsedResponse.costSavings,
        revenueSavings: parsedResponse.revenueSavings,
        explanation: parsedResponse.explanation,
        fullAnalysis: parsedResponse.fullAnalysis,
        fullResponse: claudeResponse // Include the full response for debugging
      });
    } catch (error) {
      console.error('Error with Claude API:', error);
      
      // Fallback to mock data if Claude API fails
      let costSavings = '';
      let revenueSavings = '';
      let explanation = '';
      let fullAnalysis = '';

      const teamSizeNum = parseInt(teamSize);
      const supportTeamSizeNum = parseInt(supportTeamSize);
      
      // Simple calculation logic for the fallback
      if (teamSizeNum < 20) {
        costSavings = '$50,000 - $100,000';
        revenueSavings = '$75,000 - $150,000';
        explanation = 'For small teams, Support3 can automate 30-40% of support tasks, reducing the need for additional hires and improving response times by up to 60%.';
        fullAnalysis = 'Small teams with limited support resources benefit significantly from AI automation. Support3 can handle routine queries that typically consume 30-40% of support time, allowing your team to focus on complex issues and strategic initiatives. The cost savings come primarily from improved efficiency and delayed hiring needs. (Note: This is fallback data as the Claude API call failed)';
      } else if (teamSizeNum < 100) {
        costSavings = '$150,000 - $300,000';
        revenueSavings = '$200,000 - $500,000';
        explanation = 'Mid-sized companies see significant efficiency gains with Support3, automating 40-50% of support queries and improving customer satisfaction scores by 25-35%.';
        fullAnalysis = 'Mid-sized companies typically struggle with scaling support operations efficiently. Support3 automates 40-50% of routine support tasks, reducing the need for additional hires as you grow. The improved response times and consistent quality lead to higher customer satisfaction, which directly impacts retention and expansion revenue. (Note: This is fallback data as the Claude API call failed)';
      } else {
        costSavings = '$500,000 - $1,200,000';
        revenueSavings = '$750,000 - $2,000,000';
        explanation = 'Enterprise organizations achieve substantial ROI with Support3, reducing support costs by 45-55% while capturing valuable product insights that drive revenue growth.';
        fullAnalysis = 'Enterprise organizations with large support teams can realize dramatic cost savings through Support3\'s automation capabilities. By handling 45-55% of support volume automatically, you can optimize headcount and reallocate specialized talent to high-value activities. The systematic collection of customer feedback and issue tracking also provides product teams with actionable insights that directly contribute to revenue growth through improved offerings. (Note: This is fallback data as the Claude API call failed)';
      }

      return NextResponse.json({
        costSavings,
        revenueSavings,
        explanation,
        fullAnalysis,
        error: 'Claude API call failed, using fallback data',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  } catch (error) {
    console.error('Error calculating ROI:', error);
    return NextResponse.json(
      { error: 'Failed to calculate ROI' },
      { status: 500 }
    );
  }
} 