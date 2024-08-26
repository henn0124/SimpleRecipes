import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wine } from 'lucide-react'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Be cautious with this flag
});

interface Recipe {
  name: string;
  description: string;
  ingredients: string[];
}

interface WinePairProps {
  recipe: Recipe;
}

interface WinePairing {
  wineType: string;
  pairingNotes: string;
}

export default function WinePair({ recipe }: WinePairProps) {
  const [winePairings, setWinePairings] = useState<WinePairing[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  console.log('WinePair component rendered', { recipe });

  const handleBuy = (wineType: string) => {
    // Placeholder function for buy action
    console.log(`Buying ${wineType}`);
    // You can implement actual buy functionality here
    alert(`You're purchasing ${wineType}. This is a placeholder action.`);
  };

  const generateWinePairings = async () => {
    if (!recipe) {
      console.log('No recipe provided, skipping wine pairing generation');
      return;
    }

    console.log('Generating wine pairings for recipe:', recipe.name);
    setIsLoading(true)
    setError(null)
    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        console.error('OpenAI API key is not set');
        setError('API key is missing. Please check your configuration.');
        return;
      }

      const prompt = `Imagine you are a wine sommelier making a list of recommended wine pairings to go with a meal. Based on the following recipe, suggest 3 wine pairings:

      Recipe Name: ${recipe.name}
      Description: ${recipe.description}
      Ingredients: ${recipe.ingredients.join(', ')}

      Please provide your three recommendations in the following JSON format:

      {
        "recipeName": "Name of the recipe",
        "winePairings": [
          {
            "wineType": "Name of wine varietal or blend",
            "pairingNotes": "Brief explanation of why this wine pairs well with the dish"
          },
          {
            "wineType": "Name of another wine varietal or blend",
            "pairingNotes": "Brief explanation of why this wine pairs well with the dish"
          },
          {
            "wineType": "Name of a third wine varietal or blend",
            "pairingNotes": "Brief explanation of why this wine pairs well with the dish"
          }
        ]
      }

      Guidelines for your recommendations:

      *Consider the main ingredients, flavors, and cooking methods in the recipe
      *Provide a mix of red, white, and/or sparkling wines as appropriate
      *Include both Old World and New World wine options when possible
      *Consider the intensity of flavors in the dish and match with appropriate wine body
      *Think about complementary and contrasting flavor pairings
      *Take into account any sauces, spices, or dominant flavors that might influence the pairing
      *If the recipe has a specific cultural origin, consider traditional wine pairings from that region

      Your recommendations should be specific (e.g., "Chablis" rather than just "Chardonnay") and your pairing notes should be concise but informative, explaining why each wine works well with the dish.`;

      console.log('Sending request to OpenAI API...');
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      });

      console.log('Received response from OpenAI API:', completion);

      const winePairingsString = completion.choices[0].message.content;
      console.log('Extracted wine pairings string:', winePairingsString);

      if (winePairingsString) {
        try {
          const parsedData = JSON.parse(winePairingsString);
          console.log('Parsed data:', parsedData);

          let pairings: WinePairing[];

          if (Array.isArray(parsedData.winePairings)) {
            pairings = parsedData.winePairings;
          } else if (Array.isArray(parsedData)) {
            pairings = parsedData;
          } else {
            throw new Error('Unexpected response format');
          }

          console.log('Extracted wine pairings:', pairings);
          setWinePairings(pairings);
        } catch (parseError) {
          console.error('Error parsing API response:', parseError);
          setError('Error parsing wine pairings. Please try again.');
        }
      } else {
        console.log('No wine pairings content in the API response');
        throw new Error('No wine pairings generated');
      }
    } catch (err) {
      console.error('Error generating wine pairings:', err);
      setError('Error generating wine pairings. Please try again.')
    }
    setIsLoading(false)
  }

  useEffect(() => {
    console.log('useEffect triggered in WinePair', { recipe });
    if (recipe) {
      generateWinePairings()
    }
  }, [recipe])

  console.log('Current state before rendering:', { winePairings, isLoading, error });

return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wine className="mr-2" />
          Wine Pairings
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Generating wine pairings...</p>
        ) : error ? (
          <div>
            <p className="text-red-500">{error}</p>
            <Button onClick={generateWinePairings} className="mt-2">
              Try Again
            </Button>
          </div>
        ) : winePairings.length > 0 ? (
          <ul className="space-y-4">
            {winePairings.map((pairing, index) => (
              <li key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg">{pairing.wineType}</h3>
                    <p className="text-muted-foreground">{pairing.pairingNotes}</p>
                  </div>
                  <Button 
                    onClick={() => handleBuy(pairing.wineType)}
                    className="ml-4 whitespace-nowrap"
                  >
                    Buy
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No wine pairings generated yet.</p>
        )}
      </CardContent>
    </Card>
  )
}
