import { castArray, omit } from 'lodash';
import { deepMerge } from './Global';

/**
 * The ConfigMap extends the Map object to allow for inheritance of the internal "configs". The resolved
 * configs are cached for performance.
 */
export class ConfigMap extends Map {
	constructor(entries) {
		/**
		 * We don't want to pass the entries as part of the super() call, if we do then it will call
		 * the overridden set() before we've created the cache.
		 */
		super();
		this._cache = new Map();

		if (entries) {
			for (const [key, value] of entries) {
				// We want to bypass the overridden set() during construction.
				super.set(key, value);
			}
		}
	}

	getRaw(key) {
		return super.get(key);
	}

	get(key) {
		if (!key) return {};

		/**
		 * For performance optimization we want to leverage the cache to avoid traversing due to
		 * "inheritance".
		 */
		if (this._cache.has(key)) return this._cache.get(key);

		const stack = [];
		const resolved = this._resolve(key, stack);

		this._cache.set(key, resolved);

		return resolved;
	}

	set(key, value) {
		// We clear the cache so the derived inputs don't become stale but are recomputed on next get().
		if (this._cache) this._cache.clear();
		return super.set(key, value);
	}

	delete(key) {
		// We clear the cache so the derived inputs don't become stale but are recomputed on next get().
		if (this._cache) this._cache.clear();
		return super.delete(key);
	}

	clear() {
		if (this._cache) this._cache.clear();
		return super.clear();
	}

	_resolve(key, stack) {
		// We need to detect circular "references".
		if (stack.includes(key)) {
			const loop = [...stack, key].join(' -> ');
			throw new Error(`Circular extends detected: ${loop}`);
		}

		const base = super.get(key);

		if (!base) return {};

		stack.push(key);

		const parents = base.extends ? castArray(base.extends) : [];

		let merged = {};

		/**
		 * We want to merge the parent configs in order "of inheritance", where deeper configs are
		 * overwritten by shallower configs.
		 */
		for (const parent of parents) {
			const parentResolved = this._cache?.get(parent) ?? this._resolve(parent, stack);
			merged = deepMerge(merged, parentResolved);
		}

		// We don't want to return the "extends" key since it is only used for inheritance.
		merged = deepMerge(merged, omit(base, ['extends']));
		stack.pop();

		return merged;
	}

	/**
	 * Merge type defaults into a column definition.
	 *
	 * Behavior:
	 * Looks up each type listed in `columnDef.type` (preserving order), resolves their inherited
	 * configurations, and deep-merges them in inheritance order so that shallower (later) configs
	 * overwrite deeper (earlier) ones.
	 *
	 * Finally, the method deep-merges the provided `columnDef` on top of the accumulated type
	 * defaults so that explicit fields on `columnDef` win.
	 *
	 * @returns
	 * A new object representing the merged column definition (does not mutate the `columnDef`).
	 *
	 * @example
	 * const col = { type: 'currency', header: 'Price' };
	 * const resolved = configMap.resolveColumnDef(col);
	 */
	resolveColumnDef(columnDef) {
		const { type: types = columnDef.extends } = columnDef;

		const parents = types ? castArray(types) : [];
		const stack = [];

		let merged = {};

		/**
		 * We want to merge the parent configs in order "of inheritance", where deeper configs are
		 * overwritten by shallower configs.
		 */
		for (const parent of parents) {
			const parentResolved = this._cache?.get(parent) ?? this._resolve(parent, stack);
			merged = deepMerge(merged, parentResolved);
		}

		return deepMerge(merged, columnDef);
	}
}
