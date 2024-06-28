import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useGlobalStore } from 'lib/useGlobalStore';
import { useRouter } from 'next/router';

interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
}

interface AuthCredentials {
  username: string;
  password: string;
}

const useAuth = () => {
  const queryClient = useQueryClient();
  const signUp = useGlobalStore((state) => state.signUp);
  const signIn = useGlobalStore((state) => state.signIn);
  const setUser = useGlobalStore((state) => state.setUser);
  const googleAuth = useGlobalStore((state) => state.googleAuth);
  const signOut = useGlobalStore((state) => state.signOut);
  const user = useGlobalStore((state) => state.user);
  const router = useRouter();

  const signUpMutation = useMutation({
    mutationFn: (credentials: SignUpCredentials) =>
      signUp(credentials.username, credentials.email, credentials.password),
    onError: (error) => {
      console.error('Error signing up: ', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const signInMutation = useMutation({
    mutationFn: (credentials: AuthCredentials) =>
      signIn(credentials.username, credentials.password),
    onError: (error) => {
      console.error('Error signing in: ', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const googleAuthMutation = useMutation({
    mutationFn: (accessToken: string) => googleAuth(accessToken),
    onError: (error) => {
      console.error('Error with google oauth: ', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      router.push('/dashboard');
    },
  });

  const setUserQuery = useQuery({
    queryKey: ['user'],
    queryFn: () => setUser(),
    enabled: !!user,
  });

  const signOutMutation = useMutation({
    mutationFn: () => signOut(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'drawings'] });
      router.push('/');
    },
  });

  return {
    signUpMutation,
    signInMutation,
    googleAuthMutation,
    setUserQuery,
    signOutMutation,
  };
};

export default useAuth;
