import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Be cautious with this flag
});

interface RecipeGeneratorProps {
  setRecipe: (recipe: any) => void
  setRecipeImage: (imageUrl: string) => void
}

export default function RecipeGenerator({ setRecipe, setRecipeImage }: RecipeGeneratorProps) {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const generateRecipe = async () => {
    setIsLoading(true)
    try {
      console.log('Generating recipe for input:', input);

      const promptTemplate = `
# Michelin Star Chef Recipe Generation Prompt
Imagine you are a Michelin star chef creating a new recipe for a person preparing a home meal for themselves. Generate a recipe based on the following input and criteria:
Input: ${input}
Criteria:
1. The recipe must be healthy
2. Use only whole, non-processed ingredients
3. Include 5-8 ingredients (excluding salt, pepper, and olive oil)
4. Total time to make should be under 30 minutes
5. The recipe should be simple to prepare, suitable for a home cook
6. Incorporate innovative techniques or flavor combinations that reflect your expertise as a Michelin star chef, while keeping the recipe accessible
Note: Assume the chef already has salt, pepper, and olive oil available. Do not include these in the ingredient list.
Please provide the recipe in the following JSON format:
{
  "name": "Recipe Name",
  "description": "Brief description (1-2 sentences) highlighting the Michelin star quality",
  "chefNote": "A brief note from you as a Michelin star chef about what makes this recipe special",
  "prepTime": "Preparation time in minutes",
  "cookTime": "Cooking time in minutes",
  "totalTime": "Total time in minutes (must be under 30)",
  "servings": "Number of servings",
  "ingredients": [
    "Ingredient 1",
    "Ingredient 2",
    ...
  ],
  "instructions": [
    "Step 1",
    "Step 2",
    ...
  ],
  "chefsSecret": "A special tip or technique that elevates this dish",
  "platingTip": "A simple suggestion for presenting the dish in an elevated manner"
}
Ensure that the recipe adheres to all the criteria mentioned above while incorporating elements from the input provided. Be creative and innovative, drawing from your expertise as a Michelin star chef, but keep the recipe practical and achievable for a home cook with limited time and ingredients.
`
      console.log('Sending request to OpenAI API for recipe generation...');
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: promptTemplate }],
      })
      console.log('Received response from OpenAI API:', completion);

      const recipe = completion.choices[0].message.content
      console.log('Extracted recipe content:', recipe);

      if (recipe) {
        const parsedRecipe = JSON.parse(recipe);
        console.log('Parsed recipe:', parsedRecipe);
        setRecipe(parsedRecipe)

        // Generate image using DALL-E
        console.log('Generating image for recipe...');
        const imagePrompt = `
Imagine you are a food photographer taking pictures of food dishes for a recipe book. Generate a photo of a food dish resulting from the following recipe:
${JSON.stringify(parsedRecipe, null, 2)}
Key elements for the image:
1. The dish should be plated on a round plate
2. The plate should be sitting on a light white and grey granite countertop
3. The view of the photo should be directly from above (bird's-eye view)
Additional guidelines:
* Ensure the food is styled attractively and appetizingly
* Pay attention to color contrast between the food, plate, and countertop
* Include any relevant garnishes or accompaniments mentioned in the recipe
* The lighting should be bright and even, typical of professional food photography
* The focus should be sharp across the entire dish
* If the recipe includes a specific number of servings, try to represent that in the plating
Please generate a high-resolution, photorealistic image that accurately represents the recipe while adhering to these guidelines. The image should look as if it were taken by a professional food photographer for a high-end cookbook.
`;

        const imageResponse = await openai.images.generate({
          model: "dall-e-3",
          prompt: imagePrompt,
          n: 1,
          size: "1024x1024",
        });

        console.log('Received image from DALL-E:', imageResponse);

        if (imageResponse.data && imageResponse.data[0].url) {
          setRecipeImage(imageResponse.data[0].url);
        } else {
          console.log('No image URL in the DALL-E response');
        }
      } else {
        console.log('No recipe content in the API response');
        throw new Error('No recipe generated')
      }
    } catch (error) {
      console.error('Error generating recipe or image:', error);
      setRecipe({ error: 'Sorry, there was an error generating the recipe or image. Please try again.' })
    }
    setIsLoading(false)
  }

  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <CardTitle>Michelin Star Recipe Generator</CardTitle>
        <CardDescription>Enter ingredients for a gourmet, healthy recipe</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="e.g., salmon and asparagus"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={generateRecipe} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Recipe'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}