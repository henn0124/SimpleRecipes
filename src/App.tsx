import { useState } from 'react'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import RecipeGenerator from '@/components/layout/RecipeGenerator'
import RecipeDisplay from '@/components/layout/RecipeDisplay'
import WinePair from '@/components/layout/WinePair'

// Define the Recipe type
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

export default function App() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recipeImage, setRecipeImage] = useState<string>('');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <RecipeGenerator setRecipe={setRecipe} setRecipeImage={setRecipeImage} />
        {recipe && (
          <>
            <RecipeDisplay recipe={recipe} recipeImage={recipeImage} />
            <WinePair recipe={recipe} />
          </>
        )}
        {!recipe && (
          <p className="text-center mt-8">Generate a recipe to see it displayed here!</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
