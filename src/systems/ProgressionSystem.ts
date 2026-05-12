export class ProgressionSystem {
  public unlockedRecipes: Set<string> = new Set();

  public unlockRecipe(recipeId: string): void {
    this.unlockedRecipes.add(recipeId);
  }

  public isRecipeUnlocked(recipeId: string): boolean {
    return this.unlockedRecipes.has(recipeId);
  }
}
