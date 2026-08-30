import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { selectIngredients, selectIngredientsLoading } from '@selectors';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useSelector(selectIngredients);
  const isLoading = useSelector(selectIngredientsLoading);
  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === id
  );

  if (isLoading) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return <p className='text text_type_main-medium'>Ингредиент не найден</p>;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
