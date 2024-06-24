import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useGlobalStore } from 'lib/useGlobalStore';

interface Drawing {
  title: string;
  path: string;
  base64_image: string;
}

const useDrawing = () => {
  const queryClient = useQueryClient();
  const addDrawing = useGlobalStore((state) => state.addDrawing);
  const retrieveDrawings = useGlobalStore((state) => state.retrieveDrawings);

  const user = useGlobalStore((state) => state.user);

  const addDrawingMutation = useMutation({
    mutationFn: (drawing: Drawing) =>
      addDrawing(drawing.title, drawing.path, drawing.base64_image),
    onError: (err) => console.error('Error adding drawing: ', err),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drawings'] });
      console.log('Added drawing');
    },
  });

  return {
    addDrawingMutation,
  };
};

export default useDrawing;
