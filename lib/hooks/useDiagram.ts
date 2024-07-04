import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useGlobalStore } from 'lib/useGlobalStore';

interface Drawing {
  title: string;
  nodes: Array<object>;
  edges: Array<object>;
  base64_image: string;
}

const useDiagram = () => {
  const queryClient = useQueryClient();
  const addDiagram = useGlobalStore((state) => state.addDiagram);

  const addDiagramMutation = useMutation({
    mutationFn: (drawing: Drawing) =>
      addDiagram(
        drawing.title,
        drawing.nodes,
        drawing.edges,
        drawing.base64_image
      ),
    onError: (err) => console.error('Error adding diagram: ', err),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diagrams'] });
      console.log('Added diagram');
    },
  });

  return {
    addDiagramMutation,
  };
};

export default useDiagram;
