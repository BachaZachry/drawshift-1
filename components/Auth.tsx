import { useEffect, useRef, useState } from 'react';
import { useGlobalStore } from 'lib/useGlobalStore';
import useAuth from 'lib/hooks/useAuth';
import Modal from './common/modal';
import { Input } from './common/input';
import { Typography } from './common/typography';
import { Button } from './common/button';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Label } from './common/label';
import { useRouter } from 'next/router';

interface IFormInputs {
  username: string;
  password: string;
  passwordConfirm: string;
}

enum AuthMode {
  SignIn,
  SignUp,
}

export const AuthPopup = () => {
  const [formContainer] = useAutoAnimate({});
  const setAuthModalOpen = useGlobalStore((state) => state.setAuthModalOpen);
  const authModalOpen = useGlobalStore((state) => state.authModalOpen);
  const [authMode, setAuthMode] = useState<AuthMode>(AuthMode.SignIn);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors, isSubmitted },
  } = useForm<IFormInputs>({ mode: 'onSubmit' });

  const { signInMutation, signUpMutation } = useAuth();

  const toggleAuthMode = (newAuthMode: AuthMode) => {
    setAuthMode(newAuthMode);
    setMutationError('');
    reset();
  };

  useEffect(() => {
    setValue('username', '');
    setValue('password', '');
    setValue('passwordConfirm', '');
    setAuthMode(AuthMode.SignIn);
  }, []);

  useEffect(() => {
    setMutationError(null);
  }, [authModalOpen]);

  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    setMutationError(null);
    if (authMode === AuthMode.SignIn) {
      signInMutation.mutate(
        { username: data.username, password: data.password },
        {
          onError: (error) => setMutationError(error.message),
          onSuccess: () => router.push('/dashboard'),
        }
      );
    } else if (authMode === AuthMode.SignUp) {
      signUpMutation.mutate(
        { username: data.username, password: data.password, email: '' },
        {
          onError: (error) => setMutationError(error.message),
          onSuccess: () => router.push('/dashboard'),
        }
      );
    }
  };

  const validatePasswordLength = (value: string) => {
    if (authMode !== AuthMode.SignIn && value.length < 8) {
      return 'Minimum length must be 8';
    }
    return true;
  };

  return (
    <Modal open={authModalOpen} setOpen={setAuthModalOpen}>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-primary px-4 py-8 text-left shadow backdrop-blur-2xl dark:ring-1 dark:ring-white/10 sm:rounded-lg sm:px-10">
          <form
            ref={formContainer}
            className="space-y-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Username input */}
            <div>
              <Label>Username</Label>
              <Input
                {...register('username', {
                  required: 'Username is required',
                })}
                id="email"
                value={watch('username')}
                onChange={(e: { target: { value: string } }) =>
                  authMode === AuthMode.SignIn
                    ? setValue('username', e.target.value, {
                        shouldValidate: false,
                      })
                    : setValue('username', e.target.value, {
                        shouldValidate: true,
                      })
                }
                onBlur={() =>
                  authMode === AuthMode.SignIn && trigger('username')
                }
                type="text"
                hasError={
                  isSubmitted && errors?.username?.message ? true : false
                }
                placeholder="Ross Geller"
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                {...register('password', {
                  required: 'Password is required',
                  validate: validatePasswordLength,
                })}
                id="password"
                value={watch('password')}
                onChange={(e: { target: { value: string } }) =>
                  authMode === AuthMode.SignIn
                    ? setValue('password', e.target.value, {
                        shouldValidate: false,
                      })
                    : setValue('password', e.target.value, {
                        shouldValidate: true,
                      })
                }
                onBlur={() =>
                  authMode === AuthMode.SignIn && trigger('password')
                }
                hasError={
                  isSubmitted && errors?.password?.message ? true : false
                }
                type="password"
              />
            </div>
            {authMode === AuthMode.SignUp ? (
              <div>
                <Label>Confirm Password</Label>
                <Input
                  {...register('passwordConfirm', {
                    validate: (value) =>
                      value === watch('password', '') ||
                      'Passwords do not match',
                  })}
                  id="passwordConfirm"
                  value={watch('passwordConfirm')}
                  onChange={(e: { target: { value: string } }) =>
                    setValue('passwordConfirm', e.target.value, {
                      shouldValidate: false,
                    })
                  }
                  onBlur={() => trigger('passwordConfirm')}
                  hasError={
                    isSubmitted && errors?.passwordConfirm ? true : false
                  }
                  type="password"
                />
              </div>
            ) : null}

            {/* Remember me and reset password */}
            {authMode === AuthMode.SignUp && <div className="h-5" />}
            {/* Submit button */}

            <Button
              type="submit"
              className="w-full text-white bg-indigo-500"
              isLoading={signInMutation.isPending || signUpMutation.isPending}
              disabled={signInMutation.isPending || signUpMutation.isPending}
            >
              <Typography>
                {authMode === AuthMode.SignIn ? 'Sign In' : 'Sign Up'}
              </Typography>
            </Button>

            {mutationError && authModalOpen && (
              <div className="mb-4 rounded-md bg-red-100 px-4 py-2 text-red-700">
                {mutationError}
              </div>
            )}
          </form>

          {/* Toggle between sign in and sign up */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                {authMode === AuthMode.SignIn ? (
                  <>
                    <span
                      className="cursor-pointer bg-[#11252a] px-2 text-gray-600 underline"
                      onClick={() => toggleAuthMode(AuthMode.SignUp)}
                    >
                      Or create your account now
                    </span>
                  </>
                ) : (
                  <>
                    <span
                      className="cursor-pointer bg-[#11252a] px-2 text-gray-600 underline"
                      onClick={() => toggleAuthMode(AuthMode.SignIn)}
                    >
                      Or sign in to your account
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
