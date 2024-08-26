import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Recipe {
  name: string;
  description: string;
  chefNote: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: string;
  ingredients: string[];
  instructions: string[];
  chefsSecret: string;
  platingTip: string;
}

interface RecipeDisplayProps {
  recipe: Recipe | null;
  recipeImage: string | null;
}

export default function RecipeDisplay({ recipe, recipeImage }: RecipeDisplayProps) {
  const defaultRecipe: Recipe = {
    name: "Spaghetti Carbonara",
    description: "A classic Italian pasta dish.",
    chefNote: "The key is to work quickly when combining the hot pasta with the egg mixture.",
    prepTime: "10 minutes",
    cookTime: "15 minutes",
    totalTime: "25 minutes",
    servings: "4",
    ingredients: [
      "400g spaghetti",
      "200g pancetta",
      "4 large eggs",
      "100g Parmesan cheese, grated",
      "Freshly ground black pepper",
      "Salt"
    ],
    instructions: [
      "Cook spaghetti in a large pot of salted boiling water until al dente.",
      "While pasta cooks, fry pancetta in a large skillet until crispy.",
      "In a bowl, whisk eggs, grated Parmesan, and black pepper.",
      "Drain pasta, reserving some pasta water.",
      "Quickly toss hot pasta with pancetta, then with egg mixture.",
      "Add pasta water if needed to create a creamy sauce.",
      "Serve immediately with extra Parmesan and black pepper."
    ],
    chefsSecret: "Use freshly grated Parmesan for the best flavor and texture.",
    platingTip: "Serve in warmed bowls to keep the pasta hot and creamy."
  }

  const RecipeContent = ({ recipe }: { recipe: Recipe }) => (
    <div className="flex flex-col md:flex-row">
      <div className="md:w-1/2">
        {recipeImage ? (
          <img 
            src={recipeImage}
            alt={recipe.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <img 
            src="/placeholder.svg?height=400&width=600" 
            alt={recipe.name} 
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="md:w-1/2 p-6">
        <h3 className="text-2xl font-semibold mb-4">{recipe.name}</h3>
        <p className="mb-2">{recipe.description}</p>
        <p className="mb-4"><strong>Chef's Note:</strong> {recipe.chefNote}</p>
        <div className="mb-4">
          <p><strong>Prep Time:</strong> {recipe.prepTime}</p>
          <p><strong>Cook Time:</strong> {recipe.cookTime}</p>
          <p><strong>Total Time:</strong> {recipe.totalTime}</p>
          <p><strong>Servings:</strong> {recipe.servings}</p>
        </div>
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2">Ingredients:</h4>
          <ul className="list-disc list-inside">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2">Instructions:</h4>
          <ol className="list-decimal list-inside">
            {recipe.instructions.map((step, index) => (
              <li key={index} className="mb-2">{step}</li>
            ))}
          </ol>
        </div>
        <p className="mb-2"><strong>Chef's Secret:</strong> {recipe.chefsSecret}</p>
        <p><strong>Plating Tip:</strong> {recipe.platingTip}</p>
      </div>
    </div>
  )

  return (
    <Card className="w-full mt-8">
      
      <CardContent>
        <RecipeContent recipe={recipe || defaultRecipe} />
      </CardContent>
    </Card>
  )
}