#!/usr/bin/env python3
"""
EBIA Backend API Test Suite
Tests all backend endpoints for the EBIA platform (Next.js + MongoDB)
"""

import requests
import json
import sys

# Base URL from .env
BASE_URL = "https://71b53f68-932d-4ed3-95f7-a941cf04838f.preview.emergentagent.com/api"

# Admin credentials from .env
ADMIN_EMAIL = "admin@ebia.com"
ADMIN_PASSWORD = "ebia2025"

# Test results tracking
tests_passed = 0
tests_failed = 0
test_details = []

def log_test(test_name, passed, details=""):
    """Log test result"""
    global tests_passed, tests_failed
    if passed:
        tests_passed += 1
        print(f"✅ PASS: {test_name}")
    else:
        tests_failed += 1
        print(f"❌ FAIL: {test_name}")
        if details:
            print(f"   Details: {details}")
    test_details.append({
        "test": test_name,
        "passed": passed,
        "details": details
    })

def test_1_health_check():
    """Test 1: GET /api/ -> 200 { message: 'EBIA API ok' }"""
    try:
        resp = requests.get(f"{BASE_URL}/")
        if resp.status_code == 200:
            data = resp.json()
            if data.get("message") == "EBIA API ok":
                log_test("1. Health check GET /api/", True)
                return True
            else:
                log_test("1. Health check GET /api/", False, f"Expected message='EBIA API ok', got {data}")
                return False
        else:
            log_test("1. Health check GET /api/", False, f"Expected 200, got {resp.status_code}: {resp.text}")
            return False
    except Exception as e:
        log_test("1. Health check GET /api/", False, f"Exception: {str(e)}")
        return False

def test_2_get_courses():
    """Test 2: GET /api/courses -> 200, array with at least 6 seed courses, only active, no _id"""
    try:
        resp = requests.get(f"{BASE_URL}/courses")
        if resp.status_code != 200:
            log_test("2. GET /api/courses", False, f"Expected 200, got {resp.status_code}: {resp.text}")
            return False
        
        data = resp.json()
        if not isinstance(data, list):
            log_test("2. GET /api/courses", False, f"Expected array, got {type(data)}")
            return False
        
        if len(data) < 6:
            log_test("2. GET /api/courses", False, f"Expected at least 6 courses, got {len(data)}")
            return False
        
        # Check no _id field
        for course in data:
            if "_id" in course:
                log_test("2. GET /api/courses", False, f"Found _id field in course: {course.get('title')}")
                return False
            if not course.get("is_active"):
                log_test("2. GET /api/courses", False, f"Found inactive course: {course.get('title')}")
                return False
        
        log_test("2. GET /api/courses", True)
        return True
    except Exception as e:
        log_test("2. GET /api/courses", False, f"Exception: {str(e)}")
        return False

def test_3_filter_by_category():
    """Test 3: GET /api/courses?category=ia -> 200, only courses with category=ia"""
    try:
        resp = requests.get(f"{BASE_URL}/courses?category=ia")
        if resp.status_code != 200:
            log_test("3. GET /api/courses?category=ia", False, f"Expected 200, got {resp.status_code}")
            return False
        
        data = resp.json()
        if not isinstance(data, list):
            log_test("3. GET /api/courses?category=ia", False, f"Expected array, got {type(data)}")
            return False
        
        for course in data:
            if course.get("category") != "ia":
                log_test("3. GET /api/courses?category=ia", False, f"Found non-ia course: {course.get('title')} with category={course.get('category')}")
                return False
        
        log_test("3. GET /api/courses?category=ia", True)
        return True
    except Exception as e:
        log_test("3. GET /api/courses?category=ia", False, f"Exception: {str(e)}")
        return False

def test_4_filter_by_featured():
    """Test 4: GET /api/courses?featured=1 -> 200, only featured courses"""
    try:
        resp = requests.get(f"{BASE_URL}/courses?featured=1")
        if resp.status_code != 200:
            log_test("4. GET /api/courses?featured=1", False, f"Expected 200, got {resp.status_code}")
            return False
        
        data = resp.json()
        if not isinstance(data, list):
            log_test("4. GET /api/courses?featured=1", False, f"Expected array, got {type(data)}")
            return False
        
        for course in data:
            if not course.get("featured"):
                log_test("4. GET /api/courses?featured=1", False, f"Found non-featured course: {course.get('title')}")
                return False
        
        log_test("4. GET /api/courses?featured=1", True)
        return True
    except Exception as e:
        log_test("4. GET /api/courses?featured=1", False, f"Exception: {str(e)}")
        return False

def test_5_get_course_by_slug():
    """Test 5: GET /api/courses/slug/inteligencia-artificial-desde-cero -> 200 with specific fields"""
    try:
        resp = requests.get(f"{BASE_URL}/courses/slug/inteligencia-artificial-desde-cero")
        if resp.status_code != 200:
            log_test("5. GET /api/courses/slug/inteligencia-artificial-desde-cero", False, f"Expected 200, got {resp.status_code}")
            return False
        
        data = resp.json()
        required_fields = ["id", "slug", "title", "category", "level", "short_description", 
                          "full_description", "image_url", "learn", "syllabus", "faqs"]
        
        for field in required_fields:
            if field not in data:
                log_test("5. GET /api/courses/slug/inteligencia-artificial-desde-cero", False, f"Missing field: {field}")
                return False
        
        if "_id" in data:
            log_test("5. GET /api/courses/slug/inteligencia-artificial-desde-cero", False, "Found _id field")
            return False
        
        log_test("5. GET /api/courses/slug/inteligencia-artificial-desde-cero", True)
        return True
    except Exception as e:
        log_test("5. GET /api/courses/slug/inteligencia-artificial-desde-cero", False, f"Exception: {str(e)}")
        return False

def test_6_get_nonexistent_course():
    """Test 6: GET /api/courses/slug/curso-que-no-existe -> 404"""
    try:
        resp = requests.get(f"{BASE_URL}/courses/slug/curso-que-no-existe")
        if resp.status_code == 404:
            log_test("6. GET /api/courses/slug/curso-que-no-existe (404)", True)
            return True
        else:
            log_test("6. GET /api/courses/slug/curso-que-no-existe (404)", False, f"Expected 404, got {resp.status_code}")
            return False
    except Exception as e:
        log_test("6. GET /api/courses/slug/curso-que-no-existe (404)", False, f"Exception: {str(e)}")
        return False

def test_7_post_contact_valid():
    """Test 7: POST /api/contacts with valid data -> 200 { ok: true, id }"""
    try:
        payload = {
            "name": "Juan Pérez",
            "email": "juan.perez@example.com",
            "phone": "+52 55 1234 5678",
            "message": "Me interesa el curso de IA desde cero. ¿Cuándo inicia?"
        }
        resp = requests.post(f"{BASE_URL}/contacts", json=payload)
        if resp.status_code != 200:
            log_test("7. POST /api/contacts (valid)", False, f"Expected 200, got {resp.status_code}: {resp.text}")
            return False, None
        
        data = resp.json()
        if not data.get("ok") or not data.get("id"):
            log_test("7. POST /api/contacts (valid)", False, f"Expected {{ok: true, id: ...}}, got {data}")
            return False, None
        
        log_test("7. POST /api/contacts (valid)", True)
        return True, data.get("id")
    except Exception as e:
        log_test("7. POST /api/contacts (valid)", False, f"Exception: {str(e)}")
        return False, None

def test_8_post_contact_missing_fields():
    """Test 8: POST /api/contacts missing required fields -> 400"""
    try:
        # Missing message
        payload = {"name": "Test", "email": "test@example.com"}
        resp = requests.post(f"{BASE_URL}/contacts", json=payload)
        if resp.status_code != 400:
            log_test("8. POST /api/contacts (missing fields)", False, f"Expected 400, got {resp.status_code}")
            return False
        
        log_test("8. POST /api/contacts (missing fields)", True)
        return True
    except Exception as e:
        log_test("8. POST /api/contacts (missing fields)", False, f"Exception: {str(e)}")
        return False

def test_9_admin_endpoints_without_auth():
    """Test 9: All admin endpoints without cookie -> 401"""
    endpoints = [
        ("GET", "/admin/me"),
        ("GET", "/admin/courses"),
        ("GET", "/admin/contacts"),
        ("GET", "/admin/stats"),
        ("POST", "/admin/courses"),
        ("PUT", "/admin/courses/fake-id"),
        ("DELETE", "/admin/courses/fake-id"),
    ]
    
    all_passed = True
    for method, endpoint in endpoints:
        try:
            if method == "GET":
                resp = requests.get(f"{BASE_URL}{endpoint}")
            elif method == "POST":
                resp = requests.post(f"{BASE_URL}{endpoint}", json={})
            elif method == "PUT":
                resp = requests.put(f"{BASE_URL}{endpoint}", json={})
            elif method == "DELETE":
                resp = requests.delete(f"{BASE_URL}{endpoint}")
            
            if resp.status_code != 401:
                log_test(f"9. {method} {endpoint} without auth (401)", False, f"Expected 401, got {resp.status_code}")
                all_passed = False
            else:
                log_test(f"9. {method} {endpoint} without auth (401)", True)
        except Exception as e:
            log_test(f"9. {method} {endpoint} without auth (401)", False, f"Exception: {str(e)}")
            all_passed = False
    
    return all_passed

def test_10_admin_login_success():
    """Test 10: POST /api/admin/login with correct credentials -> 200 + Set-Cookie"""
    session = requests.Session()
    try:
        payload = {"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        resp = session.post(f"{BASE_URL}/admin/login", json=payload)
        
        if resp.status_code != 200:
            log_test("10. POST /api/admin/login (success)", False, f"Expected 200, got {resp.status_code}: {resp.text}")
            return False, None
        
        data = resp.json()
        if not data.get("ok"):
            log_test("10. POST /api/admin/login (success)", False, f"Expected ok=true, got {data}")
            return False, None
        
        # Check for Set-Cookie header
        if "ebia_session" not in session.cookies:
            log_test("10. POST /api/admin/login (success)", False, "No ebia_session cookie set")
            return False, None
        
        log_test("10. POST /api/admin/login (success)", True)
        return True, session
    except Exception as e:
        log_test("10. POST /api/admin/login (success)", False, f"Exception: {str(e)}")
        return False, None

def test_11_admin_login_wrong_password():
    """Test 11: POST /api/admin/login with wrong password -> 401"""
    try:
        payload = {"email": ADMIN_EMAIL, "password": "wrongpassword"}
        resp = requests.post(f"{BASE_URL}/admin/login", json=payload)
        
        if resp.status_code == 401:
            log_test("11. POST /api/admin/login (wrong password)", True)
            return True
        else:
            log_test("11. POST /api/admin/login (wrong password)", False, f"Expected 401, got {resp.status_code}")
            return False
    except Exception as e:
        log_test("11. POST /api/admin/login (wrong password)", False, f"Exception: {str(e)}")
        return False

def test_12_admin_endpoints_with_auth(session, contact_id):
    """Test 12: Admin endpoints with session -> 200"""
    all_passed = True
    
    # GET /api/admin/me
    try:
        resp = session.get(f"{BASE_URL}/admin/me")
        if resp.status_code != 200:
            log_test("12a. GET /api/admin/me (authenticated)", False, f"Expected 200, got {resp.status_code}")
            all_passed = False
        else:
            data = resp.json()
            if not data.get("authenticated") or not data.get("email"):
                log_test("12a. GET /api/admin/me (authenticated)", False, f"Expected authenticated=true and email, got {data}")
                all_passed = False
            else:
                log_test("12a. GET /api/admin/me (authenticated)", True)
    except Exception as e:
        log_test("12a. GET /api/admin/me (authenticated)", False, f"Exception: {str(e)}")
        all_passed = False
    
    # GET /api/admin/courses
    try:
        resp = session.get(f"{BASE_URL}/admin/courses")
        if resp.status_code != 200:
            log_test("12b. GET /api/admin/courses (authenticated)", False, f"Expected 200, got {resp.status_code}")
            all_passed = False
        else:
            data = resp.json()
            if not isinstance(data, list):
                log_test("12b. GET /api/admin/courses (authenticated)", False, f"Expected array, got {type(data)}")
                all_passed = False
            else:
                log_test("12b. GET /api/admin/courses (authenticated)", True)
    except Exception as e:
        log_test("12b. GET /api/admin/courses (authenticated)", False, f"Exception: {str(e)}")
        all_passed = False
    
    # GET /api/admin/contacts
    try:
        resp = session.get(f"{BASE_URL}/admin/contacts")
        if resp.status_code != 200:
            log_test("12c. GET /api/admin/contacts (authenticated)", False, f"Expected 200, got {resp.status_code}")
            all_passed = False
        else:
            data = resp.json()
            if not isinstance(data, list):
                log_test("12c. GET /api/admin/contacts (authenticated)", False, f"Expected array, got {type(data)}")
                all_passed = False
            else:
                # Verify contact from test 7 exists
                found = any(c.get("id") == contact_id for c in data)
                if not found and contact_id:
                    log_test("12c. GET /api/admin/contacts (authenticated)", False, f"Contact from test 7 not found (id={contact_id})")
                    all_passed = False
                else:
                    log_test("12c. GET /api/admin/contacts (authenticated)", True)
    except Exception as e:
        log_test("12c. GET /api/admin/contacts (authenticated)", False, f"Exception: {str(e)}")
        all_passed = False
    
    # GET /api/admin/stats
    try:
        resp = session.get(f"{BASE_URL}/admin/stats")
        if resp.status_code != 200:
            log_test("12d. GET /api/admin/stats (authenticated)", False, f"Expected 200, got {resp.status_code}")
            all_passed = False
        else:
            data = resp.json()
            required_fields = ["courses", "activeCourses", "contacts", "unread"]
            missing = [f for f in required_fields if f not in data]
            if missing:
                log_test("12d. GET /api/admin/stats (authenticated)", False, f"Missing fields: {missing}")
                all_passed = False
            else:
                # Verify all are numbers
                if not all(isinstance(data[f], int) for f in required_fields):
                    log_test("12d. GET /api/admin/stats (authenticated)", False, f"Expected all numbers, got {data}")
                    all_passed = False
                else:
                    log_test("12d. GET /api/admin/stats (authenticated)", True)
    except Exception as e:
        log_test("12d. GET /api/admin/stats (authenticated)", False, f"Exception: {str(e)}")
        all_passed = False
    
    return all_passed

def test_13_create_course(session):
    """Test 13: POST /api/admin/courses with valid data -> 200 with id and slug"""
    try:
        payload = {
            "title": "Curso de prueba QA",
            "category": "ia",
            "level": "principiante",
            "short_description": "Descripción de prueba",
            "price": 499
        }
        resp = session.post(f"{BASE_URL}/admin/courses", json=payload)
        
        if resp.status_code != 200:
            log_test("13. POST /api/admin/courses (create)", False, f"Expected 200, got {resp.status_code}: {resp.text}")
            return False, None
        
        data = resp.json()
        if not data.get("id") or not data.get("slug"):
            log_test("13. POST /api/admin/courses (create)", False, f"Expected id and slug, got {data}")
            return False, None
        
        # Verify slug is auto-generated
        if "curso-de-prueba-qa" not in data.get("slug"):
            log_test("13. POST /api/admin/courses (create)", False, f"Expected slug like 'curso-de-prueba-qa', got {data.get('slug')}")
            return False, None
        
        log_test("13. POST /api/admin/courses (create)", True)
        return True, data.get("id")
    except Exception as e:
        log_test("13. POST /api/admin/courses (create)", False, f"Exception: {str(e)}")
        return False, None

def test_14_create_course_empty_title(session):
    """Test 14: POST /api/admin/courses with empty title -> 400"""
    try:
        payload = {
            "title": "",
            "category": "ia",
            "level": "principiante"
        }
        resp = session.post(f"{BASE_URL}/admin/courses", json=payload)
        
        if resp.status_code == 400:
            log_test("14. POST /api/admin/courses (empty title)", True)
            return True
        else:
            log_test("14. POST /api/admin/courses (empty title)", False, f"Expected 400, got {resp.status_code}")
            return False
    except Exception as e:
        log_test("14. POST /api/admin/courses (empty title)", False, f"Exception: {str(e)}")
        return False

def test_15_update_course_deactivate(session, course_id):
    """Test 15: PUT /api/admin/courses/{id} with is_active: false -> 200, verify not in public list"""
    try:
        payload = {"is_active": False, "featured": True}
        resp = session.put(f"{BASE_URL}/admin/courses/{course_id}", json=payload)
        
        if resp.status_code != 200:
            log_test("15. PUT /api/admin/courses/{id} (deactivate)", False, f"Expected 200, got {resp.status_code}: {resp.text}")
            return False
        
        # Verify not in public list
        resp_public = requests.get(f"{BASE_URL}/courses")
        if resp_public.status_code == 200:
            courses = resp_public.json()
            found = any(c.get("id") == course_id for c in courses)
            if found:
                log_test("15. PUT /api/admin/courses/{id} (deactivate)", False, f"Inactive course still in public list")
                return False
        
        log_test("15. PUT /api/admin/courses/{id} (deactivate)", True)
        return True
    except Exception as e:
        log_test("15. PUT /api/admin/courses/{id} (deactivate)", False, f"Exception: {str(e)}")
        return False

def test_16_update_course_title(session, course_id):
    """Test 16: PUT /api/admin/courses/{id} with title change -> 200, verify updated_at"""
    try:
        # Get current course
        resp_before = session.get(f"{BASE_URL}/admin/courses")
        courses_before = resp_before.json()
        course_before = next((c for c in courses_before if c.get("id") == course_id), None)
        
        if not course_before:
            log_test("16. PUT /api/admin/courses/{id} (update title)", False, f"Course not found before update")
            return False
        
        updated_at_before = course_before.get("updated_at")
        
        # Update title
        payload = {"title": "Curso de prueba QA editado"}
        resp = session.put(f"{BASE_URL}/admin/courses/{course_id}", json=payload)
        
        if resp.status_code != 200:
            log_test("16. PUT /api/admin/courses/{id} (update title)", False, f"Expected 200, got {resp.status_code}")
            return False
        
        data = resp.json()
        updated_at_after = data.get("updated_at")
        
        if updated_at_before == updated_at_after:
            log_test("16. PUT /api/admin/courses/{id} (update title)", False, f"updated_at not changed")
            return False
        
        log_test("16. PUT /api/admin/courses/{id} (update title)", True)
        return True
    except Exception as e:
        log_test("16. PUT /api/admin/courses/{id} (update title)", False, f"Exception: {str(e)}")
        return False

def test_17_delete_course(session, course_id):
    """Test 17: DELETE /api/admin/courses/{id} -> 200, verify not in admin list"""
    try:
        resp = session.delete(f"{BASE_URL}/admin/courses/{course_id}")
        
        if resp.status_code != 200:
            log_test("17. DELETE /api/admin/courses/{id}", False, f"Expected 200, got {resp.status_code}")
            return False
        
        data = resp.json()
        if not data.get("ok"):
            log_test("17. DELETE /api/admin/courses/{id}", False, f"Expected ok=true, got {data}")
            return False
        
        # Verify not in admin list
        resp_admin = session.get(f"{BASE_URL}/admin/courses")
        if resp_admin.status_code == 200:
            courses = resp_admin.json()
            found = any(c.get("id") == course_id for c in courses)
            if found:
                log_test("17. DELETE /api/admin/courses/{id}", False, f"Deleted course still in admin list")
                return False
        
        log_test("17. DELETE /api/admin/courses/{id}", True)
        return True
    except Exception as e:
        log_test("17. DELETE /api/admin/courses/{id}", False, f"Exception: {str(e)}")
        return False

def test_18_contact_operations(session, contact_id):
    """Test 18: PATCH /api/admin/contacts/{id} to mark read, then DELETE"""
    if not contact_id:
        log_test("18. Contact operations (PATCH + DELETE)", False, "No contact_id from test 7")
        return False
    
    try:
        # PATCH to mark as read
        payload = {"status": "read"}
        resp = session.patch(f"{BASE_URL}/admin/contacts/{contact_id}", json=payload)
        
        if resp.status_code != 200:
            log_test("18a. PATCH /api/admin/contacts/{id} (mark read)", False, f"Expected 200, got {resp.status_code}")
            return False
        
        # Verify status changed
        resp_contacts = session.get(f"{BASE_URL}/admin/contacts")
        if resp_contacts.status_code == 200:
            contacts = resp_contacts.json()
            contact = next((c for c in contacts if c.get("id") == contact_id), None)
            if not contact or contact.get("status") != "read":
                log_test("18a. PATCH /api/admin/contacts/{id} (mark read)", False, f"Status not updated to 'read'")
                return False
        
        log_test("18a. PATCH /api/admin/contacts/{id} (mark read)", True)
        
        # DELETE contact
        resp_delete = session.delete(f"{BASE_URL}/admin/contacts/{contact_id}")
        
        if resp_delete.status_code != 200:
            log_test("18b. DELETE /api/admin/contacts/{id}", False, f"Expected 200, got {resp_delete.status_code}")
            return False
        
        # Verify not in list
        resp_contacts_after = session.get(f"{BASE_URL}/admin/contacts")
        if resp_contacts_after.status_code == 200:
            contacts_after = resp_contacts_after.json()
            found = any(c.get("id") == contact_id for c in contacts_after)
            if found:
                log_test("18b. DELETE /api/admin/contacts/{id}", False, f"Deleted contact still in list")
                return False
        
        log_test("18b. DELETE /api/admin/contacts/{id}", True)
        return True
    except Exception as e:
        log_test("18. Contact operations (PATCH + DELETE)", False, f"Exception: {str(e)}")
        return False

def test_19_logout(session):
    """Test 19: POST /api/admin/logout -> 200, then GET /api/admin/me -> 401"""
    try:
        resp = session.post(f"{BASE_URL}/admin/logout")
        
        if resp.status_code != 200:
            log_test("19a. POST /api/admin/logout", False, f"Expected 200, got {resp.status_code}")
            return False
        
        log_test("19a. POST /api/admin/logout", True)
        
        # Verify /api/admin/me returns 401
        resp_me = session.get(f"{BASE_URL}/admin/me")
        
        if resp_me.status_code == 401:
            log_test("19b. GET /api/admin/me after logout (401)", True)
            return True
        else:
            log_test("19b. GET /api/admin/me after logout (401)", False, f"Expected 401, got {resp_me.status_code}")
            return False
    except Exception as e:
        log_test("19. Logout and verify", False, f"Exception: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("=" * 80)
    print("EBIA Backend API Test Suite")
    print("=" * 80)
    print(f"Base URL: {BASE_URL}")
    print(f"Admin Email: {ADMIN_EMAIL}")
    print("=" * 80)
    print()
    
    # Run tests in sequence
    test_1_health_check()
    test_2_get_courses()
    test_3_filter_by_category()
    test_4_filter_by_featured()
    test_5_get_course_by_slug()
    test_6_get_nonexistent_course()
    
    contact_success, contact_id = test_7_post_contact_valid()
    test_8_post_contact_missing_fields()
    
    test_9_admin_endpoints_without_auth()
    
    login_success, session = test_10_admin_login_success()
    test_11_admin_login_wrong_password()
    
    if login_success and session:
        test_12_admin_endpoints_with_auth(session, contact_id)
        
        course_created, course_id = test_13_create_course(session)
        test_14_create_course_empty_title(session)
        
        if course_created and course_id:
            test_15_update_course_deactivate(session, course_id)
            test_16_update_course_title(session, course_id)
            test_17_delete_course(session, course_id)
        
        if contact_success and contact_id:
            test_18_contact_operations(session, contact_id)
        
        test_19_logout(session)
    else:
        print("\n⚠️  Skipping authenticated tests due to login failure")
    
    # Summary
    print()
    print("=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    print(f"✅ Passed: {tests_passed}")
    print(f"❌ Failed: {tests_failed}")
    print(f"Total: {tests_passed + tests_failed}")
    print("=" * 80)
    
    if tests_failed > 0:
        print("\n❌ SOME TESTS FAILED")
        sys.exit(1)
    else:
        print("\n✅ ALL TESTS PASSED")
        sys.exit(0)

if __name__ == "__main__":
    main()
