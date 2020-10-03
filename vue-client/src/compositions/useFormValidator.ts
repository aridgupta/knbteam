import { ref } from "vue";

const cloneWithDefaultBooleans = <T>(values: T) =>
  Object.keys(values).reduce(
    (cloned, key) => ({ [key]: false, ...cloned }),
    {} as Record<keyof T, boolean>
  );

const cloneWithDefaultStrings = <T>(values: T) =>
  Object.keys(values).reduce(
    (cloned, key) => ({ [key]: "", ...cloned }),
    {} as Record<keyof T, string>
  );

export function useFormValidator<T>(
  values: T,
  cb: (values: T) => Record<keyof T, string>
) {
  const inputs = ref(cloneWithDefaultStrings(values));
  const errors = ref(cloneWithDefaultStrings(values));

  const touched = ref(cloneWithDefaultBooleans(values));

  function _touchAll() {
    for (const key in touched.value) {
      touched.value[key] = true;
    }
  }

  function _handleErrorUpdate() {
    const result = Object.assign(cb(inputs.value as T));
    for (const key in errors.value) {
      errors.value[key] = result[key];
    }
  }

  function handleBlur(e: any) {
    for (const key in touched.value) {
      if (e.target.id == key) {
        touched.value[key] = true;
      }
    }
    _handleErrorUpdate();
  }

  function handleChange() {
    _handleErrorUpdate();
  }

  function isValidated() {
    let isValidated = false;
    _handleErrorUpdate();
    _touchAll();
    for (const key in errors.value) {
      if (errors.value[key].length < 1) {
        isValidated = true;
      }
    }
    return isValidated;
  }

  return {
    inputs,
    touched,
    errors,
    handleBlur,
    handleChange,
    isValidated
  };
}
